import {Component} from "react";
import { GlobalStyle } from "GlobalStyle";
import { nanoid } from 'nanoid';
import { Phonebook } from "./Phonebook/Phonebook";
import { Contacts } from "./Contacts/Contacts";
import { Container, Title } from "./App.styled";
import { Filter } from "./Filter/Filter"
import { Report } from 'notiflix/build/notiflix-report-aio';

const LS_KEY = "contacts";

export class App extends Component {

state = {
  contacts: [
    {id: 'id-1', name: 'Rosie Simpson', number: '459-12-56'},
    {id: 'id-2', name: 'Hermione Kline', number: '443-89-12'},
    {id: 'id-3', name: 'Eden Clements', number: '645-17-79'},
    {id: 'id-4', name: 'Annie Copeland', number: '227-91-26'},
  ],
  filter: '',
}

  componentDidMount() {
    const savedContacts = localStorage.getItem(LS_KEY);
    const parsedContacts = JSON.parse(savedContacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;

    if (contacts !== prevState.contacts) {
      localStorage.setItem(LS_KEY, JSON.stringify(contacts));
}
  }


  addContact = values => {
    const inputId = nanoid();
    const { contacts} = this.state;

    const checkContact = contacts.some(contact => contact.name.toLowerCase() === values.name.toLowerCase());

    if (checkContact) {
      Report.warning(
'Contact has not been added.',
`${values.name} is already in contacts.`,
'Okay',
);
    } else {
 this.setState(prevState => {
      return {
        contacts: [...prevState.contacts, { ...values, id: inputId }]
  }
    })
    }
  };

  updateFilter = value => {

    this.setState({
      filter: value,
    });
  }
  
  handleDelete = contactId => {
    const newContacts = this.state.contacts.filter(contact => contact.id !== contactId);

    this.setState({
      contacts: newContacts,
    })
  }

  
  render() {
    const { contacts, filter } = this.state;

    const filtredContacts = contacts.filter(
      contact => {
        const filtred = contact.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
        return filtred;
      }
    )

    return (
      <Container>
        <Title>Phonebook</Title>
        <Phonebook onAddContact={this.addContact}></Phonebook>

        <Title>Contacts</Title>
        <Filter onFilter={this.updateFilter}></Filter>
        <Contacts myContacts={filtredContacts} onDelete={this.handleDelete}></Contacts>
      <GlobalStyle />
      </Container>
    );
  };
};
