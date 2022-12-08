import './ButtonSearch.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import ReactTooltip from 'react-tooltip';

interface ButtonSearchProps {
  width: string;
  tooltip: string;
  searchActive: boolean;
  setSearchActive: Dispatch<SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
}

export function ButtonSearch({
  width,
  tooltip,
  searchActive,
  setSearchActive,
  searchInput,
  setSearchInput }: ButtonSearchProps) {
  return (
    <div className='button__search'
      style={{
        width: searchActive ? width : '40px',
        padding: searchActive ? '10px' : '0px'
      }}>
      <MagnifyingGlass
        id='search_button'
        className='button__search__icon'
        size={40}
        data-tip={tooltip}
        onClick={() => {
          setSearchActive(prev => !prev);
          setSearchInput('');
        }}
      />
      <ReactTooltip delayShow={50} />

      <input
        className='button__search__input'
        maxLength={15}
        value={searchInput}
        onChange={(msg) => {
          setSearchInput(msg.target.value);
        }}
        ref={e => { if (searchActive) e?.focus(); }}
      />
      <X
        className='button__search__icon'
        size={40}
        onClick={() => {
          setSearchInput('');
        }}
      />
    </div>
  );
}