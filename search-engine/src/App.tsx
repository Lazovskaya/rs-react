import { Component, ChangeEvent } from 'react';
import SearchBar from './SearchBar';
import './App.css';
import ErrorBoundary from './ErrorBoundary';

type SearchResult = {
  id: string;
  symbol: string;
  name: string;
  image: string;
};

interface AppState {
  searchTerm: string;
  searchResults: SearchResult[];
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchTerm: '',
      searchResults: [],
    };
  }

  componentDidMount() {
    const savedSearchTerm = localStorage.getItem('searchTerm');

    if (savedSearchTerm) {
      this.setState({ searchTerm: savedSearchTerm }, async () => { await this.handleSearch() });
    }
  }

  handleSearch = async (searchTerm?: string) => {
    let endpoint;

    if (searchTerm && searchTerm.trim() !== '') {
      endpoint = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${searchTerm}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`;
    } else {
      endpoint = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=false&locale=en';
    }

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    this.setState({ searchResults: data });
  }

  handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchTerm: e.target.value });
  }

  handleThrowError = (): void => {
    throw new Error;
  }

  render(): JSX.Element {
    return (
      <ErrorBoundary>
        <div>
          <div className="top-section">
            <SearchBar
              searchTerm={this.state.searchTerm}
              onSearch={(searchTerm) => this.handleSearch(searchTerm)}
              onChange={this.handleSearchTermChange}
              onThrowError={this.handleThrowError}
            />
          </div>
          <div className="bottom-section">
            <h2 className="custom-heading">Results</h2>
            <ul className="coins-list">
              {this.state.searchResults.map((result) => (
                <li key={result.id}>
                  <div className="result-info">
                    <img src={result.image} alt={result.name} width="50" height="50" />
                    <div className="result-details">
                      <strong>{result.symbol.toUpperCase()} : {result.name}</strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;