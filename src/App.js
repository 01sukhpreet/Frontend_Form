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
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [street2, setStreet2] = useState('');
  const [city2, setCity2] = useState('');
  const [state2, setState2] = useState('');
  const [zip2, setZip2] = useState('');

  const [isEdited, setIsEdited] = useState(false);
  const [userId, setUserId] = useState('');


  const [errorMsg, setErrorMsg] = useState("")

  const [userData, setUserData] = useState([]);


  //console.log("unique values",userData)

  useEffect(() => {
    console.log("userData", userData)
  }, [userData])    //changes everytime when state is updated


  //method for posting data
  let postData = async (formData) => {

    console.log('---posting data---', formData)
    try {
      if (isEdited) {
        editData();

      }
      else {

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
      }

    } catch (error) {

      console.log('----error in post request---', error.message)
    }
  }




  //method for handling form
  const handleForm = () => {
    if (validateForm()) {

      let formData = {};
      formData.firstName = firstname;
      formData.lastName = lastname;
      formData.email = email;
      formData.phone = phone;
      let homeAddress = { street, city, state, zip }
      let officeAddress = { street2, city2, state2, zip2 }
      let address = { homeAddress, officeAddress }
      formData.address = address;
      // formData.street = street;
      // formData.city = city;
      // formData.state = state;
      // formData.zip = zip;
      // formData.street2 = street2;
      // formData.city2 = city2;
      // formData.state2 = state2;
      // formData.zip2 = zip2;


      postData(formData)

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

    console.log("------deleted data-------", deletedData)
    setUserData([])

  }




  // method for delete particular list
  const deleteTodo = async (index, elm) => {
    //alert(index)
    var newList = userData;
    newList.splice(index, 1);

    let formData = {};
    formData.user_Id = elm._id
    let deletedData = await axios.post('http://localhost:5000/user/delete', formData);

    setUserData([...newList])
  }



  //method for editing data
  const filterData = async (_id) => {
    let newEditedData = userData.find((elm) => {
      return elm._id === _id;
    })

    console.log("======filter data running =========", newEditedData)
    setFirstName(newEditedData.firstName);
    setLastName(newEditedData.lastName);
    setEmail(newEditedData.email);
    setPhone(newEditedData.phone);

    setStreet(newEditedData.street);
    setCity(newEditedData.city);
    setState(newEditedData.state);
    setZip(newEditedData.zip);

    setStreet2(newEditedData);
    setCity2(newEditedData);
    setState2(newEditedData);
    setZip2(newEditedData);


    setIsEdited(true)
    setUserId(_id)
    console.log("edited state", isEdited)
    console.log("---user id----", userId)


  }


  const editData = async () => {
    let newEditedData = {
      firstName: firstname, lastName: lastname, email,
      phone, street, city, state, zip, street2, city2, state2, zip2, userId
    };
    if (editData) {
      let updatedData = await axios.post('http://localhost:5000/user/update', newEditedData)
      console.log("========edited data ========", newEditedData)
      console.log("=======updated data from api=====", updatedData)
      console.log("====status====", updatedData.data.status)
      if (updatedData.data.status == 200) {
        showData();
      }
      setErrorMsg("Data has been updated successfully");

    }
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
                value={email}
                placeholder="Enter email" />
            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label >Phone </Form.Label>
              <Form.Control type="text" name='phone'
                onChange={e => setPhone(e.target.value)}
                placeholder="Type Phone Number" value={phone} />
            </Form.Group>

            <h5>Home Address : </h5>
            <div className='row'>
              <div className='col-6'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label >Street</Form.Label>
                  <Form.Control type="text" name='street' value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="Street" />
                </Form.Group>
              </div>
              <div className='col-6'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label >City</Form.Label>
                  <Form.Control type="text" name='city' value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City" />
                </Form.Group>
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label > State </Form.Label>
                  <Form.Control type="text" name='state' value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="State" />
                </Form.Group>
              </div>
              <div className='col-6'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label >Zip</Form.Label>
                  <Form.Control type="text" name='zip' value={zip}
                    onChange={e => setZip(e.target.value)}
                    placeholder="Zip" />
                </Form.Group>
              </div>
            </div>

            <h5>Office Address : </h5>
            <div className='row'>
              <div className='col-6'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label >Street</Form.Label>
                  <Form.Control type="text" name='street2' value={street2}
                    onChange={e => setStreet2(e.target.value)}
                    placeholder="Street" />
                </Form.Group>
              </div>
              <div className='col-6'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label >City</Form.Label>
                  <Form.Control type="text" name='city2' value={city2}
                    onChange={e => setCity2(e.target.value)}
                    placeholder="City" />
                </Form.Group>
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label > State </Form.Label>
                  <Form.Control type="text" name='state2' value={state2}
                    onChange={e => setState2(e.target.value)}
                    placeholder="State" />
                </Form.Group>
              </div>
              <div className='col-6'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label >Zip</Form.Label>
                  <Form.Control type="text" name='zip2' value={zip2}
                    onChange={e => setZip2(e.target.value)}
                    placeholder="Zip" />
                </Form.Group>
              </div>
            </div>

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
              {val.firstName}
              {val.lastName}
              {val.email}
              {val.phone}
              {val.street}
              {val.city}
              {val.state}
              {val.zip}
              {val.street2}
              {val.city2}
              {val.state2}
              {val.zip2}

              <button type="button" style={{ marginRight: "10px" }} onClick={() => deleteTodo(index, val)}>Delete</button>
              <button type="button" name="isEdited" onClick={() => filterData(val._id)}>Edit</button>
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
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;








