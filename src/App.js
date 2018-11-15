import * as React from 'react';
import { unstable_createResource as createResource } from 'react-cache';
import ErrorBoundary from './ErrorBoundary';

const apiURL = 'http://172.16.1.18:4567';

const UserResource = createResource(async (username) => {
  const response = await fetch(`${apiURL}/eu/${username}`);
  const json = await response.json();
  const user = json.data[0].id;
  const matches = json.data[0].relationships.matches.data;
  return { user, matches };
});

const MatchResource = createResource(async (id) => {
  const response = await fetch(`${apiURL}/match/${id}`);
  const json = await response.json();
  return json;
});

const Match = ({ match }) => {
  const matchData = MatchResource.read(match.id);

  return (
    <div>
      Match {match.id}
      <p>{JSON.stringify(matchData)}</p>
    </div>
  );
};

const User = ({ name }) => {
  const { user, matches } = UserResource.read(name);

  return (
    <>
      <h1>{user}</h1>
      {matches.map((match) => (
        <Match key={match.id} match={match} />
      ))}
    </>
  );
};

const App = () => {
  const [username, setUsername] = React.useState('');

  return (
    <div>
      <div>
        <input
          defaultValue={username}
          onBlur={(e) => setUsername('tsupertramp')}
        />
      </div>
      {username === '' ? null : (
        <React.Suspense fallback="Loading">
          <ErrorBoundary key={username} fallback="Error!">
            <User name={username} />
          </ErrorBoundary>
        </React.Suspense>
      )}
    </div>
  );
};

export default App;
