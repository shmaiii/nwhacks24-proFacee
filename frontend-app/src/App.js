import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import splash from './splash.gif';
import './App.css';

function SplashScreen() {
  return (
    <div className="splash-screen">
      <img src={splash} alt="Splash" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
    </div>
  );
}

function NavbarComponent() {
  return (
    <Navbar className='custom-navbar' fixed='top'>
      <Container>
        <Navbar.Brand as={Link} to="/">
          FaceFuture
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Detect
          </Nav.Link>
          <Nav.Link as={Link} to="/result">
            Result
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

function LandingPage({ onStart }) {
  return (
    <Container>
      <NavbarComponent />

      <div className="mt-3 text-center d-flex flex-column align-items-center justify-content-center vh-100">
        <h2>Welcome to FaceFuture!</h2>
        <p>
          Are you ready to explore the fascinating world where cutting-edge facial analysis meets
          ancient divination? 
        </p>
        <p>
          Let your face be the guide to unlocking the mysteries that lie ahead.
        </p>
        <p>
          Let the adventure begin, and let your face tell the tale!
        </p>
        <Button variant="dark" onClick={onStart} className="mb-3">
          Start
        </Button>
      </div>
    </Container>
  );
}


function CapturePage({ onCapture }) {
  const webcamRef = useRef(null);

  const captureHandler = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/convertIMG', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageSrc }),
      });

      if (response.ok) {
        console.log('Image successfully processed on the backend');

        if (onCapture) {
          onCapture(imageSrc);
        }
      } else {
        console.error('Failed to process the image on the backend');
      }
    } catch (error) {
      console.error('Error while communicating with the backend', error);
    }
  };  

  return (
    <Container>
      <NavbarComponent />

      <Form className="mt-3 text-center d-flex flex-column align-items-center justify-content-center vh-100">
        <Form.Group className="mb-3 text-center">
          <Webcam ref={webcamRef} />
        </Form.Group>
        <Form.Group className="mb-3 text-center">
          <Button variant="dark" onClick={captureHandler} className="mb-3">
            Capture
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

function ResultPage({ resultData }) {
  return (
    <Container>
      <NavbarComponent />

      <div className="mt-3 text-center">
        <h2>Result</h2>
        {resultData.image && <img src={resultData.image} alt="Result" className="mb-3" />}
        <p>{resultData.description}</p>
      </div>
    </Container>
  );
}

function App() {
  const [resultData, setResultData] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(splashTimeout);
  }, []);

  const startDetection = () => {
    setShowLanding(false);
  };

  return (
    <Router>
      {showSplash ? (
        <SplashScreen />
      ) : showLanding ? (
        <LandingPage onStart={startDetection} />
      ) : (
        <Routes>
          <Route path="/" element={<CapturePage onCapture={setResultData} />} />
          <Route
            path="/result"
            element={
              resultData ? (
                <ResultPage resultData={resultData} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
