function countZeroes(array, leftIndex=0, rightIndex=array.length){
    // add whatever parameters you deem necessary - good luck!!!
  
    if (leftIndex < rightIndex) {
      var mid = array.length / 2;
    
      var left = countZeroes(array.slice(0, mid), 0, mid-1);
      var right = countZeroes(array.slice(mid, array.length), mid, array.length-1);
      
      return left + right;
    } else if (leftIndex == rightIndex) {
      if (array[0] == 0) {
        return 1;
      }
    }
    
  }
  
  console.log(countZeroes([1,1,1,1,0,0])); // 2
  // console.log(countZeroes([1,0,0,0,0])); // 4
  // console.log(countZeroes([0,0,0])); // 3
  // console.log(countZeroes([1,1,1,1])); // 0
  