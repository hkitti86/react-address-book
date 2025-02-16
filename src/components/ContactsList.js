import { Link, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"


function ContactsList(props) {
  //"contacts" must be passed as prop to this component
  const { contacts, setContacts } = props
  const [filter, setFilter] = useState(3)

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.getAll('type').length === 0) {
      searchParams.set('type', 'personal')
      searchParams.append('type', 'work')
      setSearchParams(searchParams)
    }

  }, [searchParams])

  const handleContactDelete = (index) => {
    const contact = contacts[index]
    const id = contact.id
    fetch(`http://localhost:4040/contacts/${id}`, {
      method: 'DELETE'
    }).then(res => {
      if (res.status === 200) {
        setContacts(contacts.filter(contact => contact.id !== id))

      }
    })
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)

    switch (e.target.value) {
      case '1':
        searchParams.set('type', 'personal')
        break
      case '2':
        searchParams.set('type', 'work')
        break
      case '3':
        searchParams.set('type', 'personal')
        searchParams.append('type', 'work')
      default:
        break;
    }

    setSearchParams(searchParams)
  }

  return (
    <>
      <header>
        <h2>Contacts</h2>
      </header>
      <section className="contact-filter">

        <span className="filter-span">
          <input type='radio' id='personal' name="contactType" value={1} checked={filter == 1} onChange={handleFilterChange}></input>
          <label htmlFor="personal">Personal</label>
          <input type='radio' id='work' name="contactType" value={2} checked={filter == 2} onChange={handleFilterChange}></input>
          <label htmlFor="work">Work</label>
          <input type='radio' id='all' name="contactType" value={3} checked={filter == 3} onChange={handleFilterChange}></input>
          <label htmlFor="all">All</label>
        </span>

      </section>
      <ul className="contacts-list">
        {contacts.filter(contact => searchParams.getAll('type').includes(contact.contactType)).map((contact, index) => {
          const { firstName, lastName, contactType } = contact
          return (
            <li className="contact" key={index}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p>
                  {firstName} {lastName}
                </p>
                <p style={{ color: '#ec7e24', fontWeight: 'bold', fontSize: '15px' }}>{contactType.toUpperCase()}</p>
              </div>


              <span className="contact-actions">

                <Link to={`/contacts/${contact.id}`}>
                  View
                </Link>

                <div>
                  <Link to='/contacts/add' state={contact}>
                      Edit
                  </Link>
                </div>
                <Link to="#" onClick={() => handleContactDelete(index)}>
                  Delete
                </Link>

              </span>

            </li>
          )
        })}
      </ul>
    </>
  )
}
export default ContactsList
