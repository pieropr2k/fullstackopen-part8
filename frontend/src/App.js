import Authors from './components/Authors'
import { useState } from 'react';
import NewBook from './components/NewBook.js';
import Books from './components/Books.js';
import { Notification } from './components/Notification.js';

const ChangePage = ({setRoute}) => {
  return <div style={{ display: 'flex'}}>
      <button onClick={()=>setRoute('authors')}>
        authors
      </button>
      <button onClick={()=>setRoute('books')}>
        books
      </button>
      <button onClick={()=>setRoute('new_book')}>
        add book
      </button>
    </div>;
}

const WindowToRender = ({ route, notify }) => {
  switch (route) {
    case 'authors':
      return <Authors setNotify={notify}/>;
    case 'books':
      return <Books/>;
    case 'new_book':
      return <NewBook setNotify={notify}/>;
    default:
      return <div>loading...</div>;
  }
}

const App = () => {
  const [route, setRoute] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 3500)
  }

  // When a response is received, the result of the allPersons query can be found in the data field, and we can render the list of names to the screen.
  return (
    <>
      <Notification errorMessage={errorMessage} />
      <ChangePage setRoute={setRoute}/>
      <WindowToRender route={route} notify={notify}/>
    </>
  );
}

export default App;