# Questions

These questions are meant to explore many facets of product &
engineering at Unchained.

Your interviewer will work with you to assign a few of these questions
for you to answer as part of the take-home portion of our interview
process.

Your response can be formatted as a simple text file or even an email.

## Bitcoin

1. Provide some pseudocode which calculates the new network difficulty
   based on the current difficulty and a list of 2016 prior block
   times.

2. Given the following three public keys:

    ```
    02a8513d9931896d5d3afc8063148db75d8851fd1fc41b1098ba2a6a766db563d4
    03938dd09bf3dd29ddf41f264858accfa40b330c98e0ed27caf77734fac00139ba
    021a049747120345fa9017fb42d8ff3d4fb1d2ef4c80546872c5da513babd51585
    ```
    * How many valid 2-of-3 P2SH multisig addresses can you create?

    * How many [BIP-67](https://github.com/bitcoin/bips/blob/master/bip-0067.mediawiki) compliant 2-of-3 P2SH multisig addresses can you create?

    * Please share the addresses you generate along with your answers.

3. Given the following signature:

    `304302203bff8fb0547484a72cd0ef37ede0566d93aa49f5ed2eda8911fd6554d159429c021f0d368faa7edfe213d0aed8d8e6f4fc5053305503eeb9efb644db07d9b5e9ad01`

    and the code snippet:

    ```
      const {r, s} = decodedSignerInputSignatureBuffer;
      // Ignore the leading 0 if r is 33 bytes
      let rToUse = r;
      if (r.byteLength > 32) {
        rToUse = r.slice(1);
      }

      const signatureBuffer = Buffer.alloc(64);
      signatureBuffer.set(Buffer.from(rToUse), 0);
      signatureBuffer.set(Buffer.from(s), 32);
      return signatureBuffer;
    ```
    Find out why the application is claiming the signature is *invalid* when we know that the signature is **valid**.

4. Given the following mainnet signed 2-of-3 P2SH transaction [from this gist](https://gist.github.com/gavinandresen/3966071):
    > ```0100000001aca7f3b45654c230e0886a57fb988c3044ef5e8f7f39726d305c61d5e818903c00000000fd5d010048304502200187af928e9d155c4b1ac9c1c9118153239aba76774f775d7c1f9c3e106ff33c0221008822b0f658edec22274d0b6ae9de10ebf2da06b1bbdaaba4e50eb078f39e3d78014730440220795f0f4f5941a77ae032ecb9e33753788d7eb5cb0c78d805575d6b00a1d9bfed02203e1f4ad9332d1416ae01e27038e945bc9db59c732728a383a6f1ed2fb99da7a4014cc952410491bba2510912a5bd37da1fb5b1673010e43d2c6d812c514e91bfa9f2eb129e1c183329db55bd868e209aac2fbc02cb33d98fe74bf23f0c235d6126b1d8334f864104865c40293a680cb9c020e7b1e106d8c1916d3cef99aa431a56d253e69256dac09ef122b1a986818a7cb624532f062c1d1f8722084861c5c3291ccffef4ec687441048d2455d2403e08708fc1f556002f1b6cd83f992d085097f9974ab08a28838f07896fbab08f39495e15fa6fad6edbfb1e754e35fa1c7844c41f322a1863d4621353aeffffffff0140420f00000000001976a914ae56b4db13554d321c402db3961187aed1bbed5b88ac00000000```
    * What is the off-by-one bug in `0xae` aka `OP_CHECKMULTISIG`?

    * Which byte in the transaction corresponds to the fix?

    * Why can't we change it?

5. Explain why the [HODL
   waves](https://unchained-capital.com/hodlwaves/) calculation is
   straightforward for bitcoin but not possible / more arbitrary for
   Ethereum.

## Data Modeling

1. Take a look at the [descriptors spec](./specs/Descriptors.md).  How
   would you update this application's data model to handle
   descriptors?

   * What canonical ID would you use for descriptors?

   * Would you consider addresses to themselves be descriptors?

   * How would you handle the "address lookahead" issue?

   * Would you choose to store the addresses generated from
     descriptors or calculate them at runtime?

2. Write an SQL query which outputs the set of addresses that are on
   more than 10 lists.

   Write an SQL query which outputs, for each list, the total number
   of addresses on that list and the number of addresses by which that
   list exceeds or falls short of the *average number of addresses on
   a list*.

3. Imagine a data model for an online store consisting of `Customer`,
   `Product`, and `Region` models.

    * Each `Customer` has a single `Region` they live in (say `US`,
      `EU`, `ASIA`).

    * There are multiple `Product` types (say `A`, `B`, `C`).

    The store needs to model the concept of product eligibility by
    region.  Some products (say `B`) are only available in some
    regions (say `US` and `EU`) while other products are available in
    all regions.

    Create an entity relationship diagram that describes the data
    schema you'd design to model this concept of customer-product
    eligibility based on region.  Use the following eligibility
    matrix:

	| Region |  A  |  B  |  C  |
    |--------|-----|-----|-----|
    | US     | yes | yes | no  |
	| EU     | yes | yes | no  |
	| ASIA   | yes | no  | no  |
	| LATAM  | yes | yes | yes |


## Backend Application Development (Python, Flask, SQLAlchemy)

1. What are the pros & cons of using "heavy" ORMs such as SQLAlchemy?

2. Describe the difference between `DB.session.commit()` and
   `DB.session.flush()` and why you would use one vs the other in a
   Python SQLAlchemy web application.

3. Provide a PR review for [this PR](./prs/PR-2.bugfix-POC-3.diff)
   solving [this bug](./jira/POC-3.md).

4. What makes a good API?


## Frontend Application Development (JavaScript, React)

1. The code of the React application is not very DRY.  There are many
   examples of repeated code structures that could be factored out.
   Which would you highlight and tackle first?  Provide an example of
   the kind of refactor you would provide/expect.

2. Between React component state, React hooks, Redux store with its
   actions & reducers there are a LOT of state management choices &
   patterns in modern frontend React development.  Are there any
   general rules or patterns you prefer or advocate for?  How would
   you change (if at all) the way this React application manages
   state?

3. Provide a PR review for [this PR](./prs/PR-1.bugfix-POC-2.diff)
   solving [this bug](./jira/POC-2.md).

## QA

1. How much time is enough time to test for a release?  How do you determine
   what to test when you have limited time?

2. What is a bug?  How is it different from a feature?

3. Tell me about a bug that got away, what would you have done differently
   knowing what you know now?

4. How closely do you work with developers in your current role?  What would you
   like to see done differently?

## DevOps

1. Identify any potential problems/misconfigurations in the following
   nginx configuration file:

   ```
   user www-data;
   worker_processes auto;
   pid /run/nginx.pid;
   include /etc/nginx/modules-enabled/*.conf;

   events {
	worker_connections 768;
	# multi_accept on;
   }

   http {

	##
	# Basic Settings
	##

	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 65;
	types_hash_max_size 2048;
   #server_tokens off;
    proxy_cache_path /data/nginx/cache keys_zone=one:0m loader_threshold=300
                     loader_files=200 max_size=200m;
    server {
        listen 8080;
        proxy_cache mycache;

        location / {
            proxy_pass http://backend1;
        }
        location /some/path {
            proxy_pass http://backend2;
            proxy_cache_valid any 0m;
            proxy_cache_min_uses 3;
            proxy_cache_bypass $cookie_nocache           $arg_nocache$arg_comment;
        }

         upstream big_server_com {
         server 127.0.0.3:8000 weight=5;
         server 127.0.0.3:8001 weight=5;
         server 192.256.0.1:8000;
         server 192.256.0.1:8001;
         }
         keys_zone=mycache:10m purger=on;
         map $request_method $purge_method {
            PURGE 1;
            default 0;
      }
    server {
        listen      80;
        server_name www.example.com;
        location / {
            proxy_pass        https://localhost:8002;
            proxy_cache       mycache;
            proxy_cache_purge $purge_method;
        }
    }
    geo $purge_allowed {
       default        0;
       0.0.0.0        1;
       }
    map $request_method $purge_method {
       PURGE   $purge_allowed;
       default 0;
    }
	server_names_hash_bucket_size 128;
	# server_name_in_redirect off;
	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	##
	# SSL Settings
	##

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	##
	# Logging Settings
	##

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# Gzip Settings
	##

	gzip on;

	# gzip_vary on;
	# gzip_proxied any;
	# gzip_comp_level 6;
	# gzip_buffers 16 8k;
	# gzip_http_version 1.1;
	# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

	##
	# Virtual Host Configs
	##

	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;
   }
   ```

2. Document the steps required to allow a particular AWS IAM user or
   group the ability to read and write data to a specific path of a
   specific S3 bucket.

3. Write the crontab configuration to run a command `/bin/backup`
   twice a day at 1am and 1pm but only on weekdays.

4.  What is the process for reverting a commit that has already been pushed and made public?

5.  Explain the two types of pipelines in Jenkins, along with their syntax.

6.  Write a simple ad hoc ansible script that will tail the last 30 lines of a log file.

7. How do you run multiple containers using a single service?

8. Which among Puppet, Chef, SaltStack and Ansible is the best Configuration Management (CM) tool? Why?

## Cryptography, Statistics, Logic

1. Describe some of the tradeoffs (pros & cons) of block vs. stream
   ciphers.

## Algorithms

1. You are given a string composed of only 1s, 0s, and Xs.

   Write a program that will print out every possible combination
   where you replace the X with both 0 and 1.

   Example:

   ```
   $ myprogram X0
   00
   10

   $ myprogram 10X10X0
   1001000
   1001010
   1011000
   1011010
   ```

   While your program will take longer to run based on the number of
   possible combinations, your program shouldn’t crash (or hang) on an
   input with many Xs. The order of your output doesn’t matter.

   What is the big O notation for your program?

2. You have been given a gift card that is about to expire and you
   want to buy gifts for 2 friends.

   You want to spend the whole gift card, or if that’s not an option
   as close to the balance as possible. You have a list of sorted
   prices for a popular store that you know both friends like to shop
   at. Your challenge is to find two distinct items in the list whose
   sum is minimally under (or equal to) the gift card balance.

   The file contains two columns: A unique identifier of the item. You
   can assume there are no duplicates. The value of that item in
   cents. It is always a positive integer that represents the price in
   cents (1000 = $10.00 USD). You can assume every item in the store
   has a unique price.

   Write a program to find the best two items. It takes two inputs: A
   filename with a list of sorted prices The balance of your gift card
   in cents

   If no two items have a sum that is less than or equal to the
   balance on the gift card, print “Not possible”. You don’t have to
   return every possible pair that is under the balance, just one such
   pair.

   Some examples:

   ```
   $ cat prices.txt
   Candy Bar, 500
   Paperback Book, 700
   Detergent, 1000
   Headphones, 1400
   Earmuffs, 2000
   Bluetooth Stereo, 6000

   $ find-pair prices.txt 2500
   Candy Bar 500, Earmuffs 2000

   $ find-pair prices.txt 2300
   Paperback Book 700, Headphones 1400

   $ find-pair prices.txt 10000
   Earmuffs 2000, Bluetooth Stereo 6000

   $ find-pair prices.txt 1100
   Not possible
   ```

   Note: There may be many​ rows in the file, so be sure to optimize your solution to scale.

   What is the big O notation for your program?

   Bonus Question (optional)

   You are considering giving gifts to 1 more friend. Instead of
   choosing exactly 2 items to give, allow for 3 gifts. What is the
   big O notation for your program now?


3.  In a singly-linked list, each node contains a pointer to its data (head) and to the
    rest of the list (tail). Well-formed lists terminate with a NULL for the tail pointer
    however, some lists instead just loop back to an earlier element in the list.

    a.  Write an algorithm that will determine whether or not a list is well-formed. What is
        the big O notation for your program's runtime? What is the big O notation for its
        storage requirements?

    b.  Given two such lists, they can either share a common (sub*)tail, or they are are
        not related. Write an alorithm that either finds the 'Y-point' (that is the two lists
        who share a direct tail) or indicates that the two lists have no such intersection.
        What are the big O's for your algorithm's runtime and storage requirements?

    c.  How would your answer be different in question b if you knew in advance that both
        both lists were well-formed? If you knew that you had to perform this calculation
        often, and you had control over the list data structure, what could you do to
        significantly improve the performance of your algorithm, without dramatically changing
        the storage requirements for the list?

4.  Given an array of N elements, write an algorithm to find the K'th smallest element
    that runs in O(N). You are permitted to permute the elements in the array.

