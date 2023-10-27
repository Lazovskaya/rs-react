import { Component, ChangeEvent } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onThrowError: () => void;
}

interface SearchBarState {
  searchTerm: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  componentDidMount() {
    const savedSearchTerm = localStorage.getItem('savedSearchTerm');

    if (savedSearchTerm) {
      this.setState({ searchTerm: savedSearchTerm });
    }
  }

  handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchTerm: e.target.value });
  }

  handleSearch = (): void => {
    if (this.state.searchTerm.trim() !== '') {
      localStorage.setItem('savedSearchTerm', this.state.searchTerm);
    }
    this.props.onSearch(this.state.searchTerm);
  }

  handleThrowError = () => {
      throw new Error('Test error');
  }
  
  render(): JSX.Element {
    return (
      <ErrorBoundary>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={this.state.searchTerm}
          onChange={this.handleSearchTermChange}
        />
        <button onClick={this.handleSearch}>Search</button>
        <button onClick={this.handleThrowError}>Throw Error</button>
      </div>
      </ErrorBoundary>
    );
  }
}

export default SearchBar;
