import FastList from '../../fast-list';

const NUM_NODES = 10;

const lst1 = new FastList();
for (let i = 0; i < NUM_NODES; ++i) {
  lst1.push(i);
}

console.time('lst');
for (const _ of lst1) {
  //
}
console.timeEnd('lst');
