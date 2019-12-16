import LinkedList from '../../list';
import Node from '../../node';
Node.alloc = (value: any, next: any) => {
  return new Node(value, next);
};

const NUM_NODES = 10000;

const lst1 = new LinkedList();
for (let i = 0; i < NUM_NODES; ++i) {
  lst1.push(i);
}

console.time('lst');
for (const _ of lst1) {
  //
}
console.timeEnd('lst');