import React,{useState,useEffect,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  const {loading,data,errorData,sendRequest,clear}=useHttp();
  const [searchedUser,setSearchedUser]=useState('');
  const {onLoadIngredients}=props;
  const inputRef=useRef();
  useEffect(()=>{
    const timer=setTimeout(()=>{
      if(searchedUser===inputRef.current.value){
        const query=searchedUser.length===0?'':`?orderBy="title"&equalTo="${searchedUser}"`;
        sendRequest('https://react-hooks-update-ce558-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json' + query,'GET')
      }
    },500);
    return ()=>{
      clearTimeout(timer);
    }
  },[searchedUser,inputRef,sendRequest])

  useEffect(()=>{
      if(!loading&&!errorData&&data){
        const loadedIngredients=[]
          for (const key in data){
            loadedIngredients.push({
              id:key,
              title:data[key].title,
              amount:data[key].amount
            })
          } 
          onLoadIngredients(loadedIngredients)
      }
  },[data,loading,errorData,onLoadIngredients])

  return (
    <section className="search">
      {errorData&&<ErrorModal onClose={clear}>{errorData}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading&&<span>Loading...</span>}
          <input ref={inputRef} type="text" value={searchedUser} onChange={ev=>setSearchedUser(ev.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
