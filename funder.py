from pyteal import Or, If, TxnType, Gtxn, And, Global, Seq, App, Bytes, Txn, Int, Btoi, Assert, Cond, Return, Mode, compileTeal, OnComplete


def approval():
    on_creation = Seq([
        App.globalPut(Bytes("Creator"), Txn.sender()),
        Assert(Txn.application_args.length() == Int(3)),
        App.globalPut(Bytes("StartDate"), Btoi(Txn.application_args[0])),
        App.globalPut(Bytes("EndDate"), Btoi(Txn.application_args[1])),
        App.globalPut(Bytes("Goal"), Btoi(Txn.application_args[2])),
        App.globalPut(Bytes("Total"), Int(0)),
        Return(Int(1))
    ])
    is_creator = Txn.sender() == App.globalGet(Bytes("Creator"))
    donate_assertions = And(
        Global.group_size() == Int(2),
        Gtxn[1].asset_receiver() == App.globalGet(Bytes("Escrow")),
        Global.latest_timestamp() <= App.globalGet(Bytes("EndDate")),
    )

    donate = Seq([
        Assert(donate_assertions),
        App.globalPut(Bytes("Total"), Gtxn[1].asset_amount(
        )+App.globalGet(Bytes("Total"))),
        If(
            App.localGet(Int(0), Bytes("MyAmountGiven")) >= Int(0),
            App.localPut(Int(0), Bytes("MyAmountGiven"), App.localGet(
                Int(0), Bytes("MyAmountGiven")) + Gtxn[1].asset_amount()),
            App.localPut(Int(0), Bytes("MyAmountGiven"),
                         App.localGet(Int(0), Bytes("MyAmountGiven")))
        ),
        Return(Int(1))
    ])

    claim_assertions = And(
        Global.group_size() == Int(2),
        is_creator,
        Or(Gtxn[1].sender() == App.globalGet(Bytes("Escrow")),
           Gtxn[1].asset_sender() == App.globalGet(Bytes("Escrow"))),
    )

    claim = Seq([
        Assert(claim_assertions),
        App.globalPut(Bytes("Total"), Int(0)),
        Return(Int(1))
    ])

    optin = Seq([
        Assert(is_creator),
        Assert(Global.group_size() == Int(2)),
        Return(Int(1))
    ])
    opton = Seq([
        Return(Int(1))
    ])

    handle_noop = Cond(
        [Txn.application_args[0] == Bytes("donate"), donate],
        [Txn.application_args[0] == Bytes("Opt"), optin],
        [Txn.application_args[0] == Bytes("claim"), claim]
    )

    closeout = Seq([
        Return(Int(1))
    ])
    update_escrow = Seq([
        Assert(is_creator),
        Assert(Txn.application_args.length() == Int(1)),
        App.globalPut(Bytes("Escrow"), Txn.application_args[0]),
        Return(Int(1))
    ])

    deleteapp_assertions = And(
        is_creator,
        App.globalGet(Bytes("Total")) == Int(0)
    )

    deleteapp = Seq([
        Assert(deleteapp_assertions),
        Return(Int(1))
    ])
    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop],
        [Txn.on_completion() == OnComplete.OptIn, opton],
        [Txn.on_completion() == OnComplete.CloseOut, closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, update_escrow],
        [Txn.on_completion() == OnComplete.DeleteApplication, deleteapp]
    )
    return program


with open('approval.teal', 'w') as f:
    compiled = compileTeal(approval(), Mode.Application, version=3)
    f.write(compiled)


def clear_program():
    return Return(Int(1))


with open('clear.teal', 'w') as f:
    compiled = compileTeal(clear_program(), Mode.Application, version=3)
    f.write(compiled)


def escrow(app_id):
    # App_id 直接在teal文件改
    is_two_tx = Global.group_size() == Int(2)
    is_appcall = Gtxn[0].type_enum() == TxnType.ApplicationCall
    is_appid = Gtxn[0].application_id() == Int(app_id)
    acceptable_app_call = Gtxn[0].on_completion() == OnComplete.NoOp
    no_rekey = And(
        Gtxn[0].rekey_to() == Global.zero_address(),
        Gtxn[1].rekey_to() == Global.zero_address()
    )
    return And(
        is_two_tx,
        is_appcall,
        is_appid,
        acceptable_app_call,
        no_rekey,
    )


with open('escrow.teal', 'w') as f:
    compiled = compileTeal(escrow(15987743), Mode.Application, version=2)
    f.write(compiled)
