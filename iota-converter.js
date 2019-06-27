const { asciiToTrytes, trytesToAscii, trits, trytes, value, fromValue } = require('@iota/converter');
const { isTrytes } = require('@iota/validators');

module.exports = function(RED) {
    function iotaConverter(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.fromconverter = config.fromconverter;
        node.toconverter = config.toconverter;
        node.packet = config.message;

        node.on('input', function(msg) {
            //const node.formconverter = config.fromconverter;
            //const toconverter = config.toconverter;
            //var packet = msg.payload;
            if (packet = null) { packet = msg.payload};
            var result ="";
            switch (fromconverter) {
                  case 'string':
                    console.log('string: ' + packet);
                    switch (toconverter) {
                      case 'trytes':
                        result = asciiToTrytes(packet);
                        console.log({payload_trytes:result});
                        break;
                      case 'trits':
                        result = trits(packet);
                        console.log({payload_trits:result});
                        break;
                      case 'string':
                        console.log({payload_string:packet});
                        break;
                    }
                  break;
                  case 'trytes':
                    console.log('trytes: ' + packet + " isTrytes: " + isTrytes(packet));
                    switch (toconverter) {
                      case 'trytes':
                        console.log({payload_trytes:packet});
                        break;
                      case 'trits':
                        result = trits(packet);
                        console.log({payload_trits:result});
                        break;
                      case 'string':
                        result = trytesToAscii((packet));
                        console.log({payload_string:result});
                        break;
                    }
                  break;
                  case 'trits':
                     console.log('trits: ' + packet);
                     switch (toconverter) {
                         case 'trytes':
                                 result = trytes(packet);
                                 console.log({payload_trytes:result});
                                 break;
                         case 'trits':
                                 console.log({payload_trits:packet});
                                 break;
                         case 'string':
                                 result = trytesToAscii(trytes(packet));
                                 console.log({payload_string:result});
                                 break;
                     }
                   break;
                   default:
                      console.log('Lo lamentamos, por el momento no disponemos de ' + fromconverter + '.');
                }
              node.send({payload: result});
        });
    }
    RED.nodes.registerType("iotaConverter",iotaConverter);
}