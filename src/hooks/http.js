import { useCallback, useReducer } from "react";

const initialState={
    loading:false,
    errorData:null,
    data:null,
    extra:null,
    identifier:null
}

const httpReducer=(httpState,action)=>{
    switch(action.type){
      case 'SEND':
        return {loading:true, errorData: null,data:null,extra:null,identifier:action.identifier} 
      case 'RESPONSE':
        return {...httpState,loading:false,data:action.responseData,extra:action.extra} ;
      case 'ERROR':
        return {loading:false, errorData: action.errorMsg};
      case 'CLEAR':return initialState;
      default:
        throw new Error('You should not be here!')
    }
  }

const useHttp=()=>{
    const [loadAndError,setLoadAndErr]=useReducer(httpReducer,initialState);
    
    const clear=()=>{
        setLoadAndErr({type:'CLEAR'});
    }

    const sendRequest=useCallback((url,method,body,reqExtra,reqIdentifier)=>{
        setLoadAndErr({type: 'SEND',identifier:reqIdentifier});
        fetch(url,
            {
            method:method,
            body:body,
            headers:{
                'Content-Type':'application/json'
            }
          }).then(res=>{
              return res.json();
          }).then(resData=>{
              setLoadAndErr({type:'RESPONSE',responseData:resData,extra: reqExtra});
          })
          .catch(error=>{
              // setErr(error.message);
              setLoadAndErr({type:'ERROR', errorMsg:error.message});
          })
    },[]);
    return {
        loading:loadAndError.loading,
        data:loadAndError.data,
        errorData:loadAndError.errorData,
        sendRequest:sendRequest,
        reqExtra:loadAndError.extra,
        reqIdentifier:loadAndError.identifier,
        clear:clear
    };
}
export default useHttp;