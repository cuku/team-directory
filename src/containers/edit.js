import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import { updatePath } from 'redux-simple-router';

import DocumentTitle from 'react-document-title';
import Form from '../components/form';

class EditUser extends Component {
  componentWillMount() {
    const { directory, loadUser, reRoute, routeParams } = this.props;
    const { actor } = directory;
    const username = routeParams.user;

    if (!actor.admin) {
      if (username.toLowerCase() !== actor.login.toLowerCase()) reRoute('/404');
    }

    loadUser(username);
  }

  removeUser() {
    const { removeUser, routeParams, setMessage, setError, reRoute } = this.props;
    const user = routeParams.user;
    const prompt = window.prompt('Are you sure? Enter their GitHub username to continue');

    if (prompt === user) {
      removeUser(user, (err) => {
        if (err) return setError(err);
        setMessage({
          title: `${user} removed.`,
          content: 'Record has been saved.',
          action: 'Okay',
          onClickHandler: () => {
            setMessage('');
            reRoute(`/`);
          }
        });

        // TODO Emit a remove event.
      });
    } else {
      setError('GitHub account name was not entered correctly.');
    }
  }

  editUser(obj) {
    const { updateUser, setMessage, setError } = this.props;
    updateUser(obj, (err) => {
      if (err) return setError(err);
      setMessage({
        title: `${obj.github} updated!`,
        content: 'Record has been saved.',
        action: 'Okay',
        onClickHandler: () => { setMessage(''); }
      });
    });
  }

  render() {
    const { directory, setError, routeParams } = this.props;
    const { validators, normalizers, people, actor, user, form } = directory;

    return (
      <DocumentTitle title={`Edit ${routeParams.user} | Team listing`}>
        <div>
          <div className='fill-light pad2y pad2x round-top quiet dark'>
            <h3 className='icon account'>{`Edit ${routeParams.user}`}</h3>
          </div>
        {directory.form.length ? <div>
          <Form
            people={people}
            actor={actor}
            user={user}
            setError={setError}
            normalizers={normalizers}
            validators={validators}
            onDelete={this.removeUser.bind(this)}
            onSubmit={this.editUser.bind(this)}
            data={form} />
        </div> : <div>
          <div className='center'>
            <h2>No form directory found.</h2>
            <p>Check your configuration settings.</p>
          </div>
        </div>}
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, { reRoute: updatePath }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
