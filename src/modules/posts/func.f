1. Create a Post
HTTP Method: POST
Endpoint: /posts
Description: Create a new post.
Request Body: Contains the post details such as content, title, media, tags, etc.
2. Get a Single Post
HTTP Method: GET
Endpoint: /posts/:id
Description: Retrieve a single post by its ID.
URL Parameter: id (the ID of the post)
3. Get All Posts
HTTP Method: GET
Endpoint: /posts
Description: Retrieve a list of all posts, optionally with filtering, pagination, and sorting.
Query Parameters:
page (for pagination)
limit (number of posts per page)
sort (sort by field like date, boost, etc.)
tags (filter posts by tags)
community (filter posts by community)
4. Update a Post
HTTP Method: PATCH or PUT
Endpoint: /posts/:id
Description: Update an existing post by its ID.
Request Body: Contains the fields to be updated (e.g., content, title, media).
5. Delete a Post
HTTP Method: DELETE
Endpoint: /posts/:id
Description: Delete a post by its ID.
URL Parameter: id (the ID of the post)
6. Add Comments to a Post
HTTP Method: PATCH
Endpoint: /posts/:id/comments
Description: Add a comment to a post.
Request Body: Contains comment details.
7. Get Comments for a Post
HTTP Method: GET
Endpoint: /posts/:id/comments
Description: Retrieve comments for a specific post.
URL Parameter: id (the ID of the post)
Query Parameters:
page (for pagination)
limit (number of comments per page)
8. Boost a Post
HTTP Method: PATCH
Endpoint: /posts/:id/boost
Description: Increase the boost value of a post.
Request Body: Contains information to update the boost value.
9. Remove Boost from a Post
HTTP Method: PATCH
Endpoint: /posts/:id/boost
Description: Decrease or remove the boost value of a post.
Request Body: Contains information to update the boost value.
10. Get Posts by Tags
HTTP Method: GET
Endpoint: /posts/tags/:tag
Description: Retrieve posts that have a specific tag.
URL Parameter: tag (the tag to filter posts by)
11. Search Posts
HTTP Method: GET
Endpoint: /posts/search
Description: Search for posts based on a query.
Query Parameters:
query (search term)
sort (sort by relevance, date, etc.)