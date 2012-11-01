" Vimrc file, based on http://phuzz.org/vimrc.html

"colorscheme darkblue ' 4
"colorscheme desert ' 4
"colorscheme paulsevening
"colorscheme evening
"--
"colorscheme koehler
"colorscheme murphy
"colorscheme pablo
"colorscheme ron
"colorscheme torte
"colorscheme paulsgetafe
colorscheme pauls_ir_black

set ls=2            " always show status line
set tabstop=2       " Numbers of spaces for tab character
set shiftwidth=2    " number of spaces to autoindent
set expandtab       " tabs get converted to spaces
set showcmd         " display incomplete commands
set hlsearch        " highlight search
set incsearch       " incremental search
set ruler           " show cursor position at all times
set number          " show line numbers
set ignorecase      " Ignore case when searching
"set noignore case  " Don't ignore case
set title           " show title in the console title bar
set ttyfast         " smoother changes
set modeline        " Last lines in document sets vim mode
set modelines=3     " number lines checked for modelines
"set shortmess=atI  " Abbreviate messages
set sm              " Show matching braces
syntax on           " Syntax highlighting
set showtabline=2   " Show tabs all the time 
set history=50      " keep 50 lines of command line history
set backspace=indent,eol,start  " allow backspace to go back a line

" Font

" Indenting
set autoindent      " always set autoindenting on
filetype indent on  " indentation based on filetype
"set noautoindent   " Don't autoindent
"set nosmartindent
"set nocindent

" Finding files using wildmenu
set wildmenu        " enables a menu at the bottom of the vim window
set wildmode=list:longest,full  " when you do completion in the command line the list of completions is shown in two tabs
set mouse=a         " enable mouse support in the console
set path+=./**      " recursive path

" vim plugins
set nocp
filetype plugin on

" Mapping F8 to disable autoindenting, to undo re-source ~\.vimrc
:nnoremap <F8> :setl noai nocin nosi inde=<CR>

" Mapping F9 to change local working directory to the file you are editing
:nnoremap <F9> :lcd %:p:h<CR>

" Mapping F7 to clean up new style Ruby hashes to old style 1.8.7 ones
:nnoremap <F7> :%s/\s\(\w*\):\s/ :\1 => /g<CR>

" Mapping ,s to reload the .vimrc file
:nnoremap ,s <ESC>:source ~/.vimrc<CR>

" Mapping ,t to edit a file in the same directory
:nnoremap ,t :tabe %/..<CR>

" Mapping ,r to insert horizontal rule
" :nnoremap ,r <ESC>72i=<ESC><CR>
:nnoremap ,r <ESC>o<ESC>72i=<ESC>k

" Nerd tree toggle
:nnoremap ,n <ESC>:NERDTreeToggle<CR>

