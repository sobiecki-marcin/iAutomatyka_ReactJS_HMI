import React, { useState, useEffect } from 'react';
import rocket from './Rocket11.svg';
import { Container, Row, Col } from 'reactstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import useWebSocket from 'react-use-websocket';

const MainDisplay = () => {
    const [input, setInput] = useState({
        "Connected": false,
        "Engine": false,
        "Timer": false,
        "Start": false,
    });
    const [timeLeft, setTimeLeft] = useState();
    const [engine, setEngine] = useState(false)
    const [timer, setTimer] = useState(false)
    const socketUrl = 'ws://127.0.0.1:5678/';
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        shouldReconnect: (closeEvent) => true,
    });

    useEffect(() => {
        if (lastJsonMessage) {
            setInput(lastJsonMessage);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        sendJsonMessage({ 'engine': engine, 'timer': timer })
    }, [engine]);

    useEffect(() => {
        sendJsonMessage({ 'engine': engine, 'timer': timer })
    }, [timer]);

    const handleEngine = () => {
        setEngine(!engine);
    }

    const handleTimer = () => {
        setTimer(!timer);
        setTimeLeft(10);
    }

    useEffect(() => {
        const timerL = setTimeout(() => {
            if (timer) {
                if (timeLeft > 0)
                    setTimeLeft(timeLeft - 1);
                else setTimeLeft('START!!!');
            }
        }, 1000);
        return () => clearTimeout(timerL);

    }, [timeLeft]);

    const data = input;


    return (
        <Container>
            <Row style={{ paddingBottom: '40px' }}>
                <Col className="text-center"><h1>SpaceX</h1></Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
                <Col><h2 style={{ color: 'aqua' }}>Current status:</h2></Col>
            </Row>
            <Row>
                <Col><h3>Connected:</h3></Col>
                <Col sm={{ size: 9 }}><h3 style={data.Connected ? { color: 'green' } : { color: 'red' }}>{data.Connected ? "ON" : "OFF"}</h3></Col>
            </Row>
            <Row>
                <Col><h3>Engine:</h3></Col>
                <Col sm={{ size: 9 }}><h3 style={data.Engine ? { color: 'green' } : { color: 'red' }}>{data.Engine ? "ON" : "OFF"}</h3></Col>
            </Row>
            <Row>
                <Col><h3>Timer:</h3></Col>
                <Col sm={{ size: 9 }}><h3 style={data.Timer ? { color: 'green' } : { color: 'red' }}>{data.Timer ? "ON" : "OFF"}</h3></Col>
            </Row>
            <Row>
                <Col><h3>Countdown:</h3></Col>
                <Col sm={{ size: 9 }}><h3>{timeLeft}</h3></Col>
            </Row>
            <Row>
                <Col><h3>Start:</h3></Col>
                <Col sm={{ size: 9 }}> <h3 style={data.Start ? { color: 'green' } : { color: 'red' }}>{data.Start ? "ON" : "OFF"}</h3></Col>
            </Row>
            <Row style={{ paddingBottom: '10px', paddingTop: '40px' }}>
                <Col><h2 style={{ color: 'orange' }}>Control panel:</h2></Col>
            </Row>
            <Row>
                <Col><h3>Engine:</h3></Col>
                <Col sm={{ size: 9 }}>
                    <BootstrapSwitchButton onChange={handleEngine} checked={engine} />
                </Col>
            </Row>
            <Row>
                <Col><h3>Countdown:</h3></Col>
                <Col sm={{ size: 9 }}>
                    <BootstrapSwitchButton onChange={handleTimer} checked={timer} />
                </Col>
            </Row>

            <div style={data.Start ? { display: 'block' } : { display: 'none' }}>
                <img src={rocket} className="App-logo" alt="rocket" />
            </div>

        </Container>
    );
};

export default MainDisplay;