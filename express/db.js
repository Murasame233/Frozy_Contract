var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./back.db");

class DB {
  constructor() {
    this.db = new sqlite3.Database("./back.db", (e) => {
      e ? console.log(e) : console.log("DBConnected");
    });
  }
  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS apps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      show INTEGER)`
    return this.db.run(sql,(e)=>{
      if(e){
        console.log("Create Error: "+e);
      }else{
        console.log("Table Created ")
      }
    })
  }
  insertApp(id,title,content,show,resolve){
    db.run('INSERT INTO apps VALUES(?,?,?,?)',[id,title,content,show],resolve)
  }
  delApp(id,resolve){
    db.run('DELETE FROM apps WHERE id == ?',[id],resolve)
  }
  updateAppContent(id,title,content,show,resolve){
    if(show){
      show=true
    }
    db.run('UPDATE apps SET title = ?,content = ?,show=? WHERE id = ?',[title,content,show,id],resolve)
  }
  getAppContent(id,resolve){
    db.all('SELECT * FROM apps WHERE id = ?',[id],resolve)
  }
  getAllAppContent(id,resolve){
    db.all('SELECT * FROM apps WHERE show=1',resolve)
  }
}

module.exports = DB;