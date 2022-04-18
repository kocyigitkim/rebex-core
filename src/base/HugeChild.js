import React from "react";

function findDifferenceBetweenTwoArray(arr1, arr2) {
    var difference = [];
    for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) === -1) {
            difference.push(arr1[i]);
        }
    }
    return difference;
}
export function HugeChild(props) {
    const [items, setItems] = useState([]);
    const children = props.children;
    const data = props.items;
    const itemRender = props.itemRender;
    const difference = findDifferenceBetweenTwoArray(items, data);
    return (<>
        Huge Children

    </>);
}