const IOTA = require('iota.lib.js');
const TRAN = require('transliteration');

module.exports = function(RED) {
    function iotatransactions(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node._sec = 2;
	      node._firstroot = '';

	      console.log("Iota Api getTransactions: " + config.iotaNode);

	      const iota = new IOTA({ provider: config.iotaNode });
        node.readyIota = true;

        node.on('input', function(msg) {
            if (this.readyIota) {
              let txt = JSON.stringify(msg.payload);
	            let ascii = TRAN.transliterate(txt)

              console.log("message payload: "+msg.payload)
	            console.log("transliterated: "+ascii)

              console.log("Searching dataset via getTransactionsObjects - please wait")

              this.readyIota = false;
              var self = this;
              this.status({fill:"red",shape:"ring",text:"connecting"});

              if (iota.valid.isHash(txt)) {
                let iota_hash = txt;
                console.log("searching hash... : "+iota_hash);
              } else {
                let iota_hash = config.iotaHash;
                console.log("searching hash: "+iota_hash);
              }

              iota.api.getTransactionsObjects([iota_hash], (error, success) => {
                console.log("Report from iota node:")
  		            if (error) {
    	 	             console.log(error);
                     msg.payload=error;
                     self.send(msg);
  		               } else {
    		                 console.log(success);
                         msg.payload=success;
                         iota.api.getLatestInclusion([iota_hash], function(err,suc) {
                             if (err) {
                                 console.error(err);
                                 msg.payload=err;
                                 self.send(msg);
                             } else {
                                 console.log(suc);
                                 msg.payload[0].confirmed=suc[0];
                                 self.send(msg);
                            }
                         });
  		                   }
                this.status({});
                self.readyIota = true;
	             });
               this.status({fill:"red",shape:"ring",text:"fail"});
            }
        });
    }
    RED.nodes.registerType("iotatransactions",iotatransactions);
}
