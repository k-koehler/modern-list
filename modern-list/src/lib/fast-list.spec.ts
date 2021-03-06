import test from 'ava';
import FastList from './fast-list';

// FastList tests

test('doesnt err on empty list', t => {
  const l = new FastList<number>();
  for (const _ of l) {
    t.fail();
  }
  t.is(l.get(0), null);
});

test('inserts at tail & iterates the list in successive order', t => {
  const lst = new FastList<number>();
  lst
    .push(0)
    .push(1)
    .push(2);
  {
    let counter = 0;
    for (const num of lst) {
      t.is(lst.get(num), counter++);
    }
  }
});

test('basic getter works', t => {
  const lst = new FastList<number>()
    .push(0)
    .push(1)
    .push(2);
  for (let i = 0; i < 3; ++i) {
    t.is(lst.get(i), i);
  }
});

test("should return null for an element that doesn't exist", t => {
  const lst = new FastList();
  t.is(null, lst.get(3.4));
  t.is(null, lst.get(0));
  t.is(null, lst.get(1));
  t.is(null, lst.get(99999));
});

test('should set a given index', t => {
  const lst = new FastList<number>().push(10).push(20);
  t.is(lst.set(2, 50), null);
  t.is(lst.set(0, 100).get(0), 100);
  t.is(lst.set(1, 200).get(1), 200);
});

test('remove head repeatedly', t => {
  const lst = new FastList()
    .push(0)
    .push(1)
    .push(2)
    .push(3);
  t.is(lst.length, 4);
  for (let i = lst.length; i; --i) {
    lst.remove(0);
    t.is(lst.length, i - 1);
  }
});

test('remove only element', t => {
  const lst = new FastList().push(0);
  lst.remove(0);
  t.is(lst.length, 0);
  // @ts-ignore
  t.is(lst.isInitialized, false);
  // @ts-ignore
  t.is(lst.head, null);
  // @ts-ignore
  t.is(lst.tail, null);
});

test('remove head', t => {
  const lst = new FastList()
    .push(0)
    .push(1)
    .push(2);
  t.is(lst.length, 3);
  lst.remove(0);
  t.is(lst.length, 2);
  t.is(lst.get(0), 1);
  t.is(lst.get(1), 2);
});

test('remove arbitrary element', t => {
  const lst = new FastList()
    .push(0)
    .push(1)
    .push(2);
  t.is(lst.length, 3);
  lst.remove(1);
  t.is(lst.length, 2);
  t.is(lst.get(0), 0);
  t.is(lst.get(1), 2);
});

test('converts to array', t => {
  const lst = new FastList();
  for (let i = 0; i < 10; ++i) {
    lst.push(i);
  }
  t.is(lst.length, 10);
  const arr = lst.toArray();
  t.true(Array.isArray(arr));
  for (let i = 0; i < 10; ++i) {
    t.is(arr[i], i);
  }
});

test('create a stack using ll & pop', t => {
  class Stack {
    private lst: FastList;
    constructor() {
      this.lst = new FastList();
    }
    public pop(): any {
      const val = this.lst.first;
      this.lst.remove(0);
      return val;
    }
    public peek(): any {
      return this.lst.first;
    }
    public push(value: any): any {
      this.lst.pushHead(value);
    }
  }
  const stack = new Stack();
  for (let i = 1; i <= 1000; ++i) {
    stack.push(i);
  }
  for (let i = 1000; stack.peek() !== null; --i) {
    t.is(stack.peek(), i);
    t.is(stack.pop(), i);
  }
});

test('create a queue using ll & dequeue', t => {
  // tslint:disable-next-line: max-classes-per-file
  class Queue {
    private lst: FastList;
    constructor() {
      this.lst = new FastList();
    }
    public dequeue(): any {
      const val = this.lst.first;
      this.lst.remove(0);
      return val;
    }
    public peek(): any {
      return this.lst.first;
    }
    public enqueue(value: any): any {
      this.lst.push(value);
    }
  }
  const queue = new Queue();
  for (let i = 1; i <= 1000; ++i) {
    queue.enqueue(i);
  }
  for (let i = 1; queue.peek() !== null; ++i) {
    t.is(queue.peek(), i);
    t.is(queue.dequeue(), i);
  }
});

test('cache works', t => {
  const lst = new FastList()
    .push(0)
    .push(1)
    .push(2)
    .push(3);
  let hitCache: boolean = false;
  // @ts-ignore
  const oldGet = lst.cache.get;
  // @ts-ignore
  lst.cache.get = (idx: number) => {
    // @ts-ignore
    const res = oldGet.call(lst.cache, idx);
    if (res !== null) {
      hitCache = true;
    }
    return res;
  };
  lst.get(3);
  // @ts-ignore
  t.is(hitCache, false);
  lst.get(3);
  t.is(hitCache, true);
});

test('static from', t => {
  t.deepEqual(FastList.from([1, 2, 3, 4, 5]).toArray(), [1, 2, 3, 4, 5]);
});

test('pushAfter', t => {
  const lst = FastList.from([10, 20, 30, 40, 50]);
  t.deepEqual(lst.pushAfter(2, 99).toArray(), [10, 20, 30, 99, 40, 50]);
});

test('map', t => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lst = FastList.from(arr);
  t.deepEqual(
    lst.map(x => x ** 2).toArray(),
    arr.map(x => x ** 2)
  );
});

test('filter', t => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lst = FastList.from(arr);
  t.deepEqual(
    lst.filter(x => x % 2 === 0).toArray(),
    arr.filter(x => x % 2 === 0)
  );
});

test('basic reduce', t => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lst = FastList.from(arr);
  t.deepEqual(
    lst.reduce((sum, x) => sum + x),
    arr.reduce((sum, x) => sum + x)
  );
});

test('reduce to create lookup table', t => {
  const people = [
    { name: 'fred', id: 1 },
    { name: 'steve', id: 2 },
    { name: 'chris', id: 3 },
    { name: 'john', id: 4 }
  ];
  const lst = FastList.from(people);
  const lookup = lst.reduce<{ [key: string]: { name: string; id: number } }>(
    (acc, elem) => ({ ...acc, [elem.name]: elem }),
    {}
  );
  t.is(lookup.fred.id, 1);
  t.is(lookup.steve.id, 2);
  t.is(lookup.chris.id, 3);
  t.is(lookup.john.id, 4);
});

test('forEach', t => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lst = FastList.from(arr);
  let sum = 0;
  lst.forEach(num => (sum += num));
  t.is(sum, 55);
});
