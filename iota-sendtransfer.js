const IOTA = require('iota.lib.js');
const TRAN = require('transliteration');

module.exports = function(RED) {
    function iotasendtransfer(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node._sec = 2;
	node._firstroot = '';
	console.log("Publish 0-value tx on iota node: " + config.iotaNode);

	const iota = new IOTA({ provider: config.iotaNode })
        node.readyIota = true;

        node.on('input', function(msg) {
            if (this.readyIota) {
              let txt = JSON.stringify(msg.payload);
	            let ascii = TRAN.transliterate(txt);
              let trytes = iota.utils.toTrytes(ascii);

              let txttag = JSON.stringify(config.iotaTag);
              let asciitag = TRAN.transliterate(txttag);
              let trytestag = iota.utils.toTrytes(asciitag);

              console.log("message payload: "+msg.payload)
	            console.log("transliterated: "+ascii)
              console.log("trytes: "+trytes)

              console.log("Uploading dataset via sendTransfer - please wait")
	      const iota_addr = config.iotaAddr; //'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'
	      const iota_seed = config.iotaSeed; //'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'
        //const iota_value = config.iotaValue;
        let iota_value = iota.utils.convertUnits(config.iotaValue, "Ki", "i");
        console.log("sending founds: "+iota_value + + "i" + " in TAG: " +asciitag);
	      const transfers = [{
    			'value': iota_value,
    			'address': iota_addr,
    			'message': trytes
  		  }]
              this.readyIota = false;
              this.status({fill:"red",shape:"ring",text:"connecting"});
              var self = this;
              iota.api.sendTransfer(iota_seed, 14, 14, transfers, (error, success) => {
                console.log("Report from iota node:")
  		if (error) {
    	 	  console.log(error);
                  msg.payload=error ;
                  self.send(msg);
  		} else {
    		  console.log(success);
                  msg.payload=success;
                  self.send(msg);
  		}
                this.status({});
                self.readyIota = true;
	      });
            }
        });
    }
    RED.nodes.registerType("iotasendtransfer",iotasendtransfer);
}
