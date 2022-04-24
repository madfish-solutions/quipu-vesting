import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-tabs">
          <div className="tab">Distribute</div>
          <div className="tab active-tab">Explore</div>
        </div>
        <div className="header-buttons">
          <div className="button outline">Connect</div>
          <div className="button filled">Disconnect</div>
        </div>
      </header>
      <main>
        <section>
          <div className="search-bar"></div>
          <table>
            <thead>
              <tr>
                <th>Full Reward</th>
                <th>Claimed</th>
                <th>Pending</th>
                <th>Ends in</th>
                <th>{/* action button */}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1000 QUIPU</td>
                <td>1000 QUIPU</td>
                <td>1000 QUIPU</td>
                <td>25 nov 2013</td>
                <td>
                  <div className="button filled">Claim</div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
