import Authors from './components/Authors.jsx'
import { useEffect, useState } from 'react';
import NewBook from './components/NewBook.jsx';
import Books from './components/Books.jsx';
import { Notification } from './components/Notification.jsx';
import { useApolloClient } from '@apollo/client';
import LoginForm from './components/LoginForm.jsx';
import Recommend from './components/Recommend.jsx';

const ChangePage = ({ setRoute, token, logout }) => {
    return <div style={{ display: 'flex' }}>
        <button onClick={() => setRoute('authors')}>
            authors
        </button>
        <button onClick={() => setRoute('books')}>
            books
        </button>
        {
            // Exercise 8.18
            token
                ? <>
                    <button onClick={() => setRoute('new_book')}>
                        add book
                    </button>
                    <button onClick={() => setRoute('recommend')}>recommend</button>
                    <button onClick={logout}>logout</button>
                </>
                : <button onClick={() => setRoute('login')}>login</button>}
    </div>;
}

const WindowToRender = ({ route, notify, token, setToken }) => {
    switch (route) {
        case 'authors':
            return <Authors token={token} setNotify={notify} />;
        case 'books':
            return <Books/>;
        case 'new_book':
            return <NewBook setNotify={notify} />;
        // Exercise 8.18
        case 'login':
            return <LoginForm setError={notify} setToken={setToken}/>;
        // Exercise 8.20
        case 'recommend':
            return <Recommend />;
        default:
            return <div>loading...</div>;
    }
}

const App = () => {
    // Exercise 8.18
    const [token, setToken] = useState(null)
    const [route, setRoute] = useState('authors');
    const [errorMessage, setErrorMessage] = useState(null)
    const client = useApolloClient()

    useEffect(() => {
        setToken(localStorage.getItem('phonenumbers-user-token'))
    });

    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 3500)
    }

    const logout = () => {
        console.log('logout')
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    // When a response is received, the result of the allPersons query can be found in the data field, and we can render the list of names to the screen.
    return (
        <>
            <Notification errorMessage={errorMessage} />
            <ChangePage setRoute={setRoute} logout={logout} token={token} />
            <WindowToRender route={route} notify={notify} token={token} setToken={setToken} />
        </>
    );
}

export default App;