import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';

window.React = React;

const User = props => {
  return (
    <li className='users__item user'>
      <img className='user__userpic' src="http://dev.frevend.com/json/images/u_1.png" alt="userpic" />
      <div className='user__wrap' >
        <h2 className='user__title'>
          {props.name} {props.surname}
        </h2>
        <div className='user__desc' >{props.desc}</div>
      </div>
    </li>
    );
}

export class UsersList extends Component {
  render() {
    let commentNodes = this.props.data.map(function(user) {
      return (
        <User 
        key={user.id} 
        name={user.name} 
        surname={user.surname} 
        desc={user.desc} 
        />
      );
    });

    return (
      <div id="project-users">
        <ul className='users__list' >
          {commentNodes}
        </ul>
      </div>
    );
  }
};

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      offset: 0
    }
  }

  loadCommentsFromServer() {
    $.ajax({
      url      : this.props.url,
      data     : {limit: this.props.perPage, offset: this.state.offset},
      dataType : 'json',
      type     : 'GET',

      success: data => {
        this.setState({data: data.users, pageCount: Math.ceil(data.meta.total_count / data.meta.limit)});
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  componentDidMount() {
    this.loadCommentsFromServer();
  }

//  my version for saving state on page reload doesn't work
//  found more information for 'redux-localstorage' package, but time has already passed

  componentWillMount() {
    const rehydrate = JSON.parse(localStorage.getItem('someSavedState'))
    this.setState(rehydrate)
  }

  componentWillUnmount() {
     localStorage.setItem('someSavedState', JSON.stringify(this.state))
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.props.perPage);

    this.setState({offset: offset}, () => {
      this.loadCommentsFromServer();
    });
  };

  render() {
    return (
      <div className="usersBox">
        <UsersList data={this.state.data} />
        <ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={this.state.pageCount}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageClick}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
      </div>
    );
  }
};

ReactDOM.render(
  <App url={'http://localhost:3000/users'}
       author={'adele'} // демо автора модифицирован для достижения требований тестового задания
       perPage={5} />,
  document.getElementById('react-paginate')
);
