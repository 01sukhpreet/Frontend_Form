import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';

import axios from 'axios'


function App() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState("")

  const [userData, setUserData] = useState([]);


  //console.log("unique values",userData)

  useEffect(() => {
    console.log("userData", userData)
  }, [userData])


  //method for posting data
  let postData = async (formData) => {

    console.log('---posting data---', formData)


    try {

      let formRequest = await axios.post('http://localhost:5000/user/add', formData);

      if (formRequest.data.status == 200) {

        setErrorMsg("data added");
        console.log('--length of userdata---', userData.length)

        // method for check duplicate values
        if (userData.length > 0) {

          let thisItem = userData.filter((e) => {
            return e.phone == formData.phone
          });

          console.log('---data in this item---', thisItem, thisItem.length)

          if (thisItem.length > 0) {
            console.log('yes phone exists')
          } else {
            console.log('does not exist');
            setUserData(e => [...e, formData])
          }

        } else {
          console.log('user data is empty so adding first info');
          setUserData(e => [...e, formData])
        }

      } else {
        console.log('---response from server for sukh---', formRequest.data.message)
        setErrorMsg(formRequest.data.message);
      }

    } catch (error) {

      console.log('----error in post request---', error.message)

    }

  }


  // method for deleting data
  // const deleteForm = async(id) =>{
  //   await formData.delete(`${id}`)
  //   setUserData(
  //     userData.filter(data) => {
  //       return data.id !== id;
  //     }
  //   )
  // }




  //method for handling form
  const handleForm = () => {
    if (validateForm()) {

      let formData = {};
      formData.firstname = firstname;
      formData.lastname = lastname;
      formData.email = email;
      formData.phone = phone;

      postData(formData)

      //if(postData.SukhpreetReq.data.status == 200){
      // setUserData(e => [...e, formData])
      //}else{
      //  setUserData("Invalid")
      //}

    }
  }




  // method for showing data
  const showData = async () => {
    let getData = await axios.get('http://localhost:5000/user');

    console.log("----show data-----", getData.data.data)

    setUserData(getData.data.data)

  }


  // method for deleting all data 
  const deleteData = async () => {
    let deletedData = await axios.delete('http://localhost:5000/user/delete');

    console.log("------deleted data-------",deletedData)
    setUserData([])
    
  }




  // method for delete particular list
  const deleteTodo = async(index, elm) => {
    //alert(index)
    var newList = userData;
    newList.splice(index, 1);

    let formData = {};
    formData.user_Id = elm._id


    let deletedData = await axios.post('http://localhost:5000/user/delete',formData);
    
    setUserData([...newList])
  }
  


  //method for validating form

  function validateForm() {
    if (firstname == 0) {
      //alert("FirstName can't be empty")
      setErrorMsg("FirstName can't be empty")
      return false

    }
    if (lastname == 0) {
      //alert("LastName can't be empty")
      setErrorMsg("lastName can't be empty")
      return false

    }
    if (email == 0) {
      //alert("Email can't be empty")
      setErrorMsg("Email can't be empty")
      return false

    }
    if (phone == 0) {
      //alert("Phone can't be empty")
      setErrorMsg("Phone can't be empty")
      return false
    }
    if (firstname.length < 3) {
      //alert("name can't less than 3 ")
      setErrorMsg("name can't less than 3")
      return false
    }
    return true
  }


  return (
    <div className="container">
      <div className="row">
        <div className='col-md-6'>
          <h4>Registration Form</h4>
          <Form onSubmit={e => e.preventDefault()} onValidate>

            <Form.Group className="mb-3" controlId="formBasicEmail" >
              <Form.Label >First Name</Form.Label>
              <Form.Control type="text" name='firstname'
                onChange={e => setFirstName(e.target.value)}
                placeholder="Type First name" value={firstname} />
            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name='lastname'
                onChange={e => setLastName(e.target.value)}
                placeholder="Type Last name" value={lastname} />
            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name='email'
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email" />
            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label >Phone </Form.Label>
              <Form.Control type="text" name='phone'
                onChange={e => setPhone(e.target.value)}
                placeholder="Type Phone Number" value={phone} />
            </Form.Group>
            <p>{errorMsg}</p>

            <div className='row'>
              <div className='col-2'>
                <Button variant="primary" type="submit" onClick={handleForm}>
                  Submit
                </Button>
              </div>
              <div className='col-10'>
                <Button variant="primary" type="submit" onClick={showData}>
                  Show Data
                </Button>
              </div>
            </div>

          </Form>


          {/* 
      <button onClick={addStaticData}>Add new static data</button> */}
        </div>

        <div className='col-md-6'>

          {(userData.map((val, index) => {
            return <p key={val._id}>
              {val.firstname}
              {val.lastname}
              {val.email}
              {val.phone}
              <button type="button" onClick={() => deleteTodo(index, val)}>Delete</button>
            </p>
          }))}


          <div className='row'>
            <div className='col-2'>
              <Button variant="primary" type="submit" onClick={() => setUserData([])}>
                clear
              </Button></div>
            <div className='col-10'>
              <Button variant="primary" type="submit" onClick={deleteData}>
                Delete Data
              </Button>
            </div></div>

        </div>
      </div>
    </div>
  );
}

export default App;








