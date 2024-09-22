# HackerNews API

In this project, firebase, published officially by Y Combinator, was connected to the remote database and the data was made available with api.

Official Repo : [github.com/HackerNews/API](https://github.com/HackerNews/API)

## Development

This project is written in [Deno](https://deno.land/). [Hono](https://hono.dev/) library is used to prepare the api router. To run the project on your own
computer you need to download Deno and then run the following bash code in the terminal.

```bash
deno task start
```

## API Using

The first 30 pages of the 500 top stories of the homepage come in a paginated form. you can paginate by adding the following queries from the url or you can
bring data from the page you want.

```http
GET /?page=1&limit=30
```

Example Url : [https://hacker-news.deno.dev/?page=1&limit=30](https://hacker-news.deno.dev/?page=1&limit=30)

| Query | Default |
| ----- | ------- |
| page  | 1       |
| limit | 30      |

---

### Get Stories By Type

```http
GET /{{storyType}}
```

| Story Types |
| ----------- |
| topstories  |
| newstories  |
| beststories |
| askstories  |
| showstories |
| jobstories  |

Example Url : [https://hacker-news.deno.dev/newstories](https://hacker-news.deno.dev/newstories)

---

### Get Item

```http
GET /item/{{itemId}}
```

Example Url : [https://hacker-news.deno.dev/item/37719016](https://hacker-news.deno.dev/item/37719016)

---

### Get User

```http
GET /user/{{userName}}
```

Example Url : [https://hacker-news.deno.dev/user/ibodev](https://hacker-news.deno.dev/user/ibodev)

---

### Get User Submitted

```http
GET /user/{{userName}}/submitted?page=1&limit=30
```

Example Url : [https://hacker-news.deno.dev/user/ibodev/submitted?page=1&limit=30](https://hacker-news.deno.dev/user/ibodev/submitted?page=1&limit=30)

---
