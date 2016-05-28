import KafkaPlugin from './plugins/kafka';
import TestHelper from './helper';

const helper = new TestHelper();
const plugin = new KafkaPlugin();
helper.registerPlugin(plugin);

plugin.initialize().then(() => {
  plugin.publish({ topic: 'test', messages: ['bar'] })
  .then((msg) => {
  })
  .catch((err) => {
    console.log(err);
  });

  plugin.subscribe('test', 'bar')
  .then((message) => {
    console.log('success! => ', message);
  })
  .catch((err) => {
    console.log(err);
  });

});
