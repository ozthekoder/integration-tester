const saved = new Map()
saved.set('a', ['q', 'w', 'e']);
saved.set('b', { r: 'r', t: 't', y: 'y' });

const foo = {
  var1: "${a}",
  var2: "${b}"
};

const func = new Function(...saved.keys(), 'return JSON.parse(`' + JSON.stringify(foo) + '`);');
console.log(JSON.stringify(func(...saved.values()), null, 2));
