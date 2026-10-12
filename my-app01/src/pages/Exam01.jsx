import React from 'react';

function Exam01(props) {
    
    const arr = [1,2,3,4,5];
    return (
       <>
      {arr.map(function(i, val){
       return <div>{val}</div>
      })
    }
       </>
    );
}

export default Exam01;