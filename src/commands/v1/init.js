import prompt from 'prompt';
import { authenticate } from '../../api/actions';

//
// Take user's username and password and authenticate the user - then store the access token in a file. 
//

export const cmd = 'init <submissionId>';
export const description = 'Initiate the directory as a ';
export const action = function(submissionId) {
  prompt.start();
  prompt.get([
    {
      description: 'Username',
      name: 'username',
      type: 'string'
    },
    {
      description: 'Password',
      name: 'password',
      type: 'password'
    }
  ], (username, password) => {
    console.log('YOU WERE HACKED!!!');
    console.log('your username: ', username);
    console.log('your password: ', password);

    // @todo: if the folder is a git repository, add the 
  });
};
