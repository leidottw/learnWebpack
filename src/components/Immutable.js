import React from 'react';
import { Link } from 'react-router';
import { Map, List, Seq, fromJS, Range, is } from 'immutable';

class Immutable extends React.Component {
    constructor(props) {
        super(props);

        var map0 = Map({a: 1, b: 10, c: 3});
        var map1 = Map({a: 1, b: 2, c: 3});
        var map2 = map1.set('b', 10);
        var clone = map2;
        console.dir(map0)
        console.dir(map1)
        console.dir(map2)
        console.log(map0.equals(map2));
        console.log(clone.equals(map2));
        console.log(is(map0, map2));

        var list0 = List([1,2,3,4,5,6]);
        var list1 = List([1,2,3,4,5]);
        var list2 = list1.push(6);
        console.log('1size', list1.size)
        console.log('2size', list2.size)
        var clone = list2;
        console.dir(list0)
        console.dir(list1)
        console.dir(list2)
        console.dir(list0.equals(list2))

        var obj = {a: 1, b: 2, c: 3};
        var arr = [1,2,4];
        var a = Seq(arr).map(x => x * x);
        console.log(a)
        console.log(a.toObject())


        var objFromJs = fromJS(obj);
        console.log(objFromJs);
        objFromJs.forEach((val, key) => console.log(`${key}: ${val}`));

        var arrFromJs = fromJS(arr);
        console.log(arrFromJs);
        arrFromJs.forEach((val, key) => console.log(`${key}: ${val}`));

        const oddSquares = Seq([ 1, 2, 3, 4, 5, 6, 7, 8 ])
          .filter(x => { console.log('fileter'); return x % 2; })
          .map(x => { console.log('map'); return x * x; })

        console.log(oddSquares.get(1))

        const seq = Map({ a: 1, b: 2, c: 3 }).toSeq();
        console.log(seq.flip().map(key => key.toUpperCase()).flip().toObject());

        console.log(Range(1, Infinity)
          .skip(1000) // 1001, 1002, 1003...
          .map(n => -n) // -1001, -1002, -1003...
          .filter(n => n % 2 === 0) // -1002, -1004, -1006...
          .take(2) // -1002, -1004
          .reduce((r, n) => r * n, 1)); // -1004 * (-1002 * 1) = 1006008

    }

    render() {
        return <div></div>;
    }
};

export default Immutable;
