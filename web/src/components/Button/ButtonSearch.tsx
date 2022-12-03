import './ButtonSearch.scss';
import { MagnifyingGlass, X } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';

interface ButtonSearchProps {
  width: string;
  tooltip: string;
  padding: string;
  searchActive: boolean;
  setSearchActive: Dispatch<SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
}

export function ButtonSearch({
  width,
  tooltip,
  padding,
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
      <MagnifyingGlass className='button__search__icon'
        size={40}
        data-html={true}
        data-tip={tooltip}
        onClick={() => {
          setSearchActive(prev => !prev);
          setSearchInput('');
        }}
      />

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