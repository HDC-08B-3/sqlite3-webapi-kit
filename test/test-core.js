// Generated by CoffeeScript 1.12.6
var assert, coverage, dbname, e, fs, sqlited, vows;

vows = require('vows');

assert = require('assert');

fs = require('fs');

try {
  coverage = require('coverage');
} catch (error) {
  e = error;
  coverage = {
    require: require
  };
}

try {
  sqlited = coverage.require(__dirname + "/../lib/sqlite3-webapi-kit");
} catch (error) {
  e = error;
  sqlited = coverage.require("../lib/sqlite3-webapi-kit");
}

dbname = 'test.db3';

vows.describe('core test').addBatch({
  'DB指定なし: メモリ上のDBを開く': {
    topic: function() {
      sqlited.open((function(_this) {
        return function(err) {
          return _this.callback(err, sqlited.dbname());
        };
      })(this));
    },
    'DBオブジェクトのfilenameが「:memory:」になっている': (function(_this) {
      return function(topic) {
        return assert.equal(topic, ':memory:');
      };
    })(this)
  }
}).addBatch({
  '2重オープン': {
    topic: function() {
      sqlited.open((function(_this) {
        return function(err) {
          return _this.callback(null, err.errno);
        };
      })(this));
    },
    '1007エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1007);
      };
    })(this)
  }
}).addBatch({
  'DBクローズ': {
    topic: function() {
      sqlited.close((function(_this) {
        return function(err) {
          return _this.callback(err, sqlited._db);
        };
      })(this));
    },
    '_dbがnullになっている': (function(_this) {
      return function(topic) {
        return assert.equal(topic, null);
      };
    })(this)
  }
}).addBatch({
  '2重クローズ(何もしない)': {
    topic: function() {
      sqlited.close((function(_this) {
        return function(err) {
          return _this.callback(err, sqlited._db);
        };
      })(this));
    },
    '_dbがnullになっている': (function(_this) {
      return function(topic) {
        return assert.equal(topic, null);
      };
    })(this)
  }
}).addBatch({
  'DBを開いていない状態でスキーマ取得': {
    topic: function() {
      sqlited.schema((function(_this) {
        return function(err, result) {
          return _this.callback(null, err.errno);
        };
      })(this));
    },
    '1008エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1008);
      };
    })(this)
  }
}).addBatch({
  'DB指定(:memory:) & オープン時実行SQLなし: メモリ上のDBを開く': {
    topic: function() {
      sqlited.close((function(_this) {
        return function() {
          return sqlited.open(':memory:', function(err) {
            return _this.callback(err, sqlited.dbname());
          });
        };
      })(this));
    },
    'DBオブジェクトのfilenameが「:memory:」になっている': (function(_this) {
      return function(topic) {
        return assert.equal(topic, ':memory:');
      };
    })(this)
  }
}).addBatch({
  'DB指定(:memory:) & オープン時実行SQL指定(文字列): メモリ上のDBを開いてSQLを実行': {
    topic: function() {
      sqlited.close((function(_this) {
        return function() {
          var initSql;
          initSql = 'create table test (c integer)';
          return sqlited.open(':memory:', initSql, function(err) {
            var chkSql;
            if (err != null) {
              return _this.callback(err);
            }
            chkSql = "select * from sqlite_master where type = 'table'";
            return sqlited.get(chkSql, function(err, result) {
              return _this.callback(err, {
                sql: initSql,
                dbname: sqlited.dbname(),
                result: result
              });
            });
          });
        };
      })(this));
    },
    'DBオブジェクトのfilenameが「:memory:」になっている': (function(_this) {
      return function(topic) {
        return assert.equal(topic.dbname, ':memory:');
      };
    })(this),
    'testテーブルが作成されている': (function(_this) {
      return function(topic) {
        return assert.equal(topic.result.length, 1);
      };
    })(this),
    '登録されたtestテーブルのSQLと作成時SQLが同一': (function(_this) {
      return function(topic) {
        return assert.equal(topic.result[0].sql.toUpperCase(), topic.sql.toUpperCase());
      };
    })(this)
  }
}).addBatch({
  'DB指定(:memory:) & オープン時実行SQL指定(配列): メモリ上のDBを開いてSQLを実行': {
    topic: function() {
      sqlited.close((function(_this) {
        return function() {
          var initSql;
          initSql = ['create table test (c varchar(100))', "insert into test (c) values ('テスト')"];
          return sqlited.open(':memory:', initSql, function(err) {
            var chkSql;
            if (err != null) {
              return _this.callback(err);
            }
            chkSql = 'select * from test';
            return sqlited.get(chkSql, function(err, result) {
              return _this.callback(err, {
                dbname: sqlited.dbname(),
                result: result
              });
            });
          });
        };
      })(this));
    },
    'DBオブジェクトのfilenameが「:memory:」になっている': (function(_this) {
      return function(topic) {
        return assert.equal(topic.dbname, ':memory:');
      };
    })(this),
    'testテーブルにデータが1件作成されている': (function(_this) {
      return function(topic) {
        return assert.equal(topic.result.length, 1);
      };
    })(this),
    'testテーブルの内容の検証': (function(_this) {
      return function(topic) {
        return assert.equal(topic.result[0].c, 'テスト');
      };
    })(this)
  }
}).addBatch({
  'DBを開いていない状態でget': {
    topic: function() {
      sqlited.close((function(_this) {
        return function() {
          return sqlited.get('select * from test', function(err, result) {
            return _this.callback(null, err.errno);
          });
        };
      })(this));
    },
    '1008エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1008);
      };
    })(this)
  }
}).addBatch({
  'DBを開いていない状態でpost': {
    topic: function() {
      sqlited.post('delete from test', (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.errno);
        };
      })(this));
    },
    '1008エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1008);
      };
    })(this)
  }
}).addBatch({
  'DBを開いていない状態でpostMulti': {
    topic: function() {
      var sql;
      sql = ['update test set c = null', "update test set c = 'test'"];
      sqlited.postMulti(sql, (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.errno);
        };
      })(this));
    },
    '1008エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1008);
      };
    })(this)
  }
}).addBatch({
  'DB指定(ファイル名) & オープン時実行SQL指定(配列): ディスク上にDBを作成してSQLを実行': {
    topic: function() {
      var initSql;
      if (fs.existsSync(dbname)) {
        fs.unlinkSync(dbname);
      }
      initSql = ['create table test1 (c1 integer, c2 varchar(100))', 'create index idx_test1_c1 on test1(c1)', "insert into test1 (c1, c2) values (1, 'てすと01')", "insert into test1 (c1, c2) values (2, 'てすと02')", "insert into test1 (c1, c2) values (3, 'てすと03')"];
      sqlited.open(dbname, initSql, (function(_this) {
        return function(err) {
          if (err != null) {
            return _this.callback(err);
          }
          return sqlited.close(function() {
            if (err != null) {
              return _this.callback(err);
            }
            return sqlited.open(dbname, function(err) {
              var chkSql;
              if (err != null) {
                return _this.callback(err);
              }
              chkSql = 'select * from test1';
              return sqlited.get(chkSql, function(err, result) {
                return _this.callback(err, {
                  dbname: sqlited.dbname(),
                  result: result
                });
              });
            });
          });
        };
      })(this));
    },
    'DBオブジェクトのfilenameがファイル名になっている': (function(_this) {
      return function(topic) {
        return assert.equal(topic.dbname, dbname);
      };
    })(this),
    'test1テーブルにデータが3件作成されている': (function(_this) {
      return function(topic) {
        return assert.equal(topic.result.length, 3);
      };
    })(this),
    'test1テーブルの内容の検証': (function(_this) {
      return function(topic) {
        var i, j, len, r, ref, results;
        ref = topic.result;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          r = ref[i];
          assert.equal(r.c1, i + 1);
          results.push(assert.equal(r.c2, "てすと0" + (i + 1)));
        }
        return results;
      };
    })(this)
  }
}).addBatch({
  'getメソッド(バインドなし & 0件)': {
    topic: function() {
      var sql;
      sql = 'select * from test1 where c2 is null';
      sqlited.get(sql, (function(_this) {
        return function(err, result) {
          return _this.callback(err, result.length);
        };
      })(this));
    },
    '取得結果が0件': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 0);
      };
    })(this)
  }
}).addBatch({
  'getメソッド(文字列bind)': {
    topic: function() {
      var bind, sql;
      sql = 'select * from test1 where c2 like ?';
      bind = '%02';
      sqlited.get(sql, bind, (function(_this) {
        return function(err, result) {
          return _this.callback(err, result);
        };
      })(this));
    },
    'test1テーブルの内容の検証': (function(_this) {
      return function(topic) {
        assert.equal(topic.length, 1);
        return assert.equal(topic[0].c1, 2);
      };
    })(this)
  }
}).addBatch({
  'getメソッド(数値bind)': {
    topic: function() {
      var bind, sql;
      sql = 'select * from test1 where c1 < ?';
      bind = '3';
      sqlited.get(sql, bind, (function(_this) {
        return function(err, result) {
          return _this.callback(err, result);
        };
      })(this));
    },
    'test1テーブルの内容の検証': (function(_this) {
      return function(topic) {
        assert.equal(topic.length, 2);
        return assert.equal(topic[0].c1, 1);
      };
    })(this)
  }
}).addBatch({
  'getメソッド(配列bind)': {
    topic: function() {
      var bind, sql;
      sql = 'select c1 from test1 where c1 = ? or c2 like ? order by c1 desc';
      bind = [1, '%03'];
      sqlited.get(sql, bind, (function(_this) {
        return function(err, result) {
          return _this.callback(err, result);
        };
      })(this));
    },
    'test1テーブルの内容の検証': (function(_this) {
      return function(topic) {
        return assert.deepEqual(topic, [
          {
            c1: 3
          }, {
            c1: 1
          }
        ]);
      };
    })(this)
  }
}).addBatch({
  'getメソッド(連想配列bind)': {
    topic: function() {
      var bind, sql;
      sql = 'select c2 from test1 where c1 = $c1 or c2 like $c2';
      bind = {
        $c1: 2,
        $c2: '%01'
      };
      sqlited.get(sql, bind, (function(_this) {
        return function(err, result) {
          return _this.callback(err, result);
        };
      })(this));
    },
    'test1テーブルの内容の検証': (function(_this) {
      return function(topic) {
        return assert.deepEqual(topic, [
          {
            c2: 'てすと01'
          }, {
            c2: 'てすと02'
          }
        ]);
      };
    })(this)
  }
}).addBatch({
  'getメソッド(存在しないテーブル)': {
    topic: function() {
      var sql;
      sql = 'select * from tttest1';
      sqlited.get(sql, (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.message);
        };
      })(this));
    },
    'エラーメッセージの検証': (function(_this) {
      return function(topic) {
        return assert.match(topic, /no such table/);
      };
    })(this)
  }
}).addBatch({
  'getメソッドで配列を指定': {
    topic: function() {
      var sql;
      sql = ['select * from test1', 'select * from test2'];
      sqlited.get(sql, (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.errno);
        };
      })(this));
    },
    '1003エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1003);
      };
    })(this)
  }
}).addBatch({
  'getメソッドでselect文以外を実行': {
    topic: function() {
      sqlited.get("insert into test1 (c2) values ('てすと99')", (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.errno);
        };
      })(this));
    },
    '1006エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1006);
      };
    })(this)
  }
}).addBatch({
  'postMultiメソッド': {
    topic: function() {
      var sql;
      sql = ['create table test2 (f1 integer primary key, f2 integer default 0, f3 text, f4 varchar ( 16 ) default null)', 'create view view_test2_f1_f4 as select f1, f4 from test2', 'create index idx_test2_f2_f3 on test2(f2, f3)', 'create index idx_test2_f2_f4 on test2(f2, f4)'];
      sqlited.postMulti(sql, (function(_this) {
        return function(err, result) {
          var chkSql;
          if (err != null) {
            return _this.callback(err);
          }
          chkSql = "select * from sqlite_master where type = 'table' and name = 'test2'";
          return sqlited.get(chkSql, function(err, result) {
            return _this.callback(err, {
              sql: sql[0],
              result: result
            });
          });
        };
      })(this));
    },
    'test2テーブルが作成されている': (function(_this) {
      return function(topic) {
        return assert.equal(topic.result.length, 1);
      };
    })(this),
    '登録されたtestテーブルのSQLと作成時SQLが同一': (function(_this) {
      return function(topic) {
        return assert.equal(topic.result[0].sql.toUpperCase(), topic.sql.toUpperCase());
      };
    })(this)
  }
}).addBatch({
  'postメソッド': {
    topic: function() {
      var bind, sql;
      sql = 'insert into test2 (f3) values (?)';
      bind = 'testtesttest';
      sqlited.post(sql, bind, (function(_this) {
        return function(err, updateInfo) {
          if (err != null) {
            return _this.callback(err);
          }
          return sqlited.get('select * from test2', function(err, result) {
            return _this.callback(err, {
              updateInfo: updateInfo,
              result: result
            });
          });
        };
      })(this));
    },
    '更新処理結果の検証': (function(_this) {
      return function(topic) {
        assert.equal(topic.updateInfo.lastID, 1);
        return assert.equal(topic.updateInfo.changes, 1);
      };
    })(this),
    '更新後のtest2テーブルの検証': (function(_this) {
      return function(topic) {
        var expected;
        expected = {
          f1: 1,
          f2: 0,
          f3: 'testtesttest',
          f4: null
        };
        return assert.deepEqual(topic.result[0], expected);
      };
    })(this)
  }
}).addBatch({
  'スキーマ取得': {
    topic: function() {
      sqlited.schema((function(_this) {
        return function(err, result) {
          return _this.callback(err, result);
        };
      })(this));
    },
    'スキーマの検証': (function(_this) {
      return function(topic) {
        var expected1, expected2, expected3;
        expected1 = {
          fields: [
            {
              name: 'c1',
              type: 'integer'
            }, {
              name: 'c2',
              type: 'varchar',
              length: 100
            }
          ],
          indexes: {
            idx_test1_c1: ['c1']
          },
          sql: 'CREATE TABLE test1 (c1 integer, c2 varchar(100))'
        };
        assert.deepEqual(topic.main.tables.test1, expected1);
        expected2 = {
          fields: [
            {
              name: 'f1',
              type: 'integer',
              primary_key: true
            }, {
              name: 'f2',
              type: 'integer',
              "default": 0
            }, {
              name: 'f3',
              type: 'text'
            }, {
              name: 'f4',
              type: 'varchar',
              length: 16,
              "default": null
            }
          ],
          indexes: {
            idx_test2_f2_f3: ['f2', 'f3'],
            idx_test2_f2_f4: ['f2', 'f4']
          },
          sql: 'CREATE TABLE test2 (f1 integer primary key, f2 integer default 0, f3 text, f4 varchar ( 16 ) default null)'
        };
        assert.deepEqual(topic.main.tables.test2, expected2);
        expected3 = {
          view_test2_f1_f4: 'CREATE VIEW view_test2_f1_f4 as select f1, f4 from test2'
        };
        return assert.deepEqual(topic.main.views, expected3);
      };
    })(this)
  }
}).addBatch({
  '不正なSQLでpostメソッド': {
    topic: function() {
      sqlited.post('update test1 set c999 = ?', 'xxx', (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.message);
        };
      })(this));
    },
    'エラーメッセージの検証': (function(_this) {
      return function(topic) {
        return assert.match(topic, /no such column/);
      };
    })(this)
  }
}).addBatch({
  'postメソッドでSELECT文を実行': {
    topic: function() {
      sqlited.post('select * from test1', (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.errno);
        };
      })(this));
    },
    '1005エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1005);
      };
    })(this)
  }
}).addBatch({
  'postメソッドで配列を指定': {
    topic: function() {
      var sql;
      sql = ['delete from test1', 'delete from test2'];
      sqlited.post(sql, (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.errno);
        };
      })(this));
    },
    '1003エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1003);
      };
    })(this)
  }
}).addBatch({
  '不正なSQLでpostMultiメソッド(実行前)': {
    topic: function() {
      sqlited.postMulti(999, (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.errno);
        };
      })(this));
    },
    '1003エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic, 1003);
      };
    })(this)
  }
}).addBatch({
  '不正なSQLでpostMultiメソッド(実行時)': {
    topic: function() {
      sqlited.postMulti('drop table test0', (function(_this) {
        return function(err, result) {
          return _this.callback(null, err.message);
        };
      })(this));
    },
    'エラーメッセージの検証': (function(_this) {
      return function(topic) {
        return assert.match(topic, /no such table/);
      };
    })(this)
  }
}).addBatch({
  'postMultiメソッドでSQL配列の途中でSELECT文を実行(トランザクション指定)': {
    topic: function() {
      var sql;
      sql = ['delete from test1', 'select count(*) as c from test1'];
      sqlited.postMulti(sql, true, (function(_this) {
        return function(err, result) {
          var errno;
          if (err == null) {
            return _this.callback(true);
          }
          errno = err.errno;
          return sqlited.get('select count(*) as cnt from test1', function(err, result) {
            return _this.callback(err, {
              errno: errno,
              result: result
            });
          });
        };
      })(this));
    },
    '1005エラーが発生する': (function(_this) {
      return function(topic) {
        return assert.equal(topic.errno, 1005);
      };
    })(this),
    'ロールバックされている': (function(_this) {
      return function(topic) {
        return assert.deepEqual(topic.result, [
          {
            cnt: 3
          }
        ]);
      };
    })(this)
  }
})["export"](module);
