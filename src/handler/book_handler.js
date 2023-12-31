import { nanoid } from 'nanoid';
import books from '../data-source/book.js';

export const Home = (req, h) => {
  return h.response({
    message: 'Bookshelf API Version 1.0.0',
    status: 'success',
  });
};

export const addBook = (req, h) => {
  const { name, year, author, 
    summary, publisher, pageCount, 
    readPage, reading, } = req.payload;

  const createDate = new Date().toISOString();

  const newBook = {
    id: nanoid(16),
    name: name,
    author: author,
    summary: summary,
    year: year,
    publisher: publisher,
    pageCount: pageCount,
    readPage: readPage,
    reading: reading,
    finished: pageCount === readPage ? true : false,
    insertedAt: createDate,
    updatedAt: createDate,
  };

  if (name === '' || name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' 
    }).code(400);
  }

  books.push(newBook)

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: newBook.id
    }
  }).code(201);

};

export const getAllBooks = (req, h) => {
  const filtered = books.map(el => {
    return {
      id: el.id,
      name: el.name,
      publisher: el.publisher
    };
  });

  return h.response({
    status: 'success',
    data: {
      books: filtered,
    },
  }).code(200);
}

export const getBookById = (req, h) => {
  const { bookId } = req.params;

 const book = books.filter((item) => item.id == bookId)[0];

 if (book != undefined) {
    return h.response({
      status: 'success',
      data: {
          book: book,
      },
    }).code(200);
 }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404);
};

export const updateBook = (req, h) => {
  const { bookId } = req.params;

  const { name, year, author,
          summary, publisher, pageCount,
          readPage, reading } = req.payload;
  
  const i = books.findIndex((n) => n.id === bookId);

  const updatedAt = new Date().toISOString();

  if (name === '' || name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if ( readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  if (i === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  books[i] = {
    ...books[i],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading, 
    updatedAt,
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
}

export const deleteBook = (req, h) => {
  const { bookId } = req.params;
  const i = books.findIndex((n) => n.id === bookId);

  if ( i === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(i, 1);
  
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  })
}
