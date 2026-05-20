import { test, expect } from '@playwright/test';

test.describe('Books API Automation', () => {

    // Generador dinámico
    const randomNumber = Math.floor(
        Math.random() * 100000
    );

    const books = [
        {
            name: 'Playwright Automation',
            isbn: 'abc',
            aisle: `${randomNumber}`,
            author: 'Jose Mateo'
        },
        {
            name: 'TypeScript Testing',
            isbn: 'xyz',
            aisle: `${randomNumber + 1}`,
            author: 'Jose Mateo'
        }
    ];

    test('CRUD Flow API Testing', async ({ request }) => {

        const createdBooks: string[] = [];

        // CREATE BOOKS
        for (const book of books) {

            const createResponse = await request.post(
                '/Library/Addbook.php',
                {
                    data: book
                }
            );

            expect(createResponse.status()).toBe(200);

            const createBody = await createResponse.json();

            expect(createBody.Msg)
                .toContain('successfully added');

            createdBooks.push(
                `${book.isbn}${book.aisle}`
            );
        }

        // GET BOOKS
        for (const bookId of createdBooks) {

            const getResponse = await request.get(
                '/Library/GetBook.php',
                {
                    params: {
                        ID: bookId
                    }
                }
            );

            expect(getResponse.status()).toBe(200);

            const getBody = await getResponse.json();

            expect(getBody[0].book_name)
                .toBeTruthy();
        }

        // DELETE BOOKS
        for (const bookId of createdBooks) {

            const deleteResponse = await request.post(
                '/Library/DeleteBook.php',
                {
                    data: {
                        ID: bookId
                    }
                }
            );

            expect(deleteResponse.status()).toBe(200);

            const deleteBody = await deleteResponse.json();

            expect(deleteBody.msg)
                .toContain('successfully deleted');
        }

        // VALIDATE DELETED
        for (const bookId of createdBooks) {

            const getDeletedResponse = await request.get(
                '/Library/GetBook.php',
                {
                    params: {
                        ID: bookId
                    }
                }
            );

            const deletedBody = await getDeletedResponse.json();

            expect(deletedBody.msg)
                .toContain('does not exists');
        }
    });
});