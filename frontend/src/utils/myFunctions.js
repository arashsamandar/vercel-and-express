
const arashFetchIterator = async function* (i) {
    const result = await fetch('https://jsonplaceholder.typicode.com/posts/' + i);
    const data = await result.json();
    yield data;
}
async function useGeneratorForAwait(){
    for(let i = 1; i < 10; i++) {
        console.log(await arashFetchIterator(i).next());
    }
}
// ----------------- End of Generators -----------------

function myMultiplierFunction(...args){
    let result = 1;
    args.forEach(num => {
        result *= num
    });
    return result;
}

console.log(myMultiplierFunction(3,4,2,6));

export {
    myMultiplierFunction,
    useGeneratorForAwait,
}