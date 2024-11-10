from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_cors import CORS
import data_manager,csv
from datetime import datetime
import pandas as pd

app = Flask(__name__)
# Configure CORS to allow requests from your frontend origin and with credentials
CORS(app, supports_credentials=True)
file_post = "post_data2.csv"
file_user = 'user_data.csv'
@app.route("/post_prob",methods = ["POST"])
def redirect_post(): 

    username = request.get_json().get('username')
    return redirect(url_for('homepage'))
@app.route('/')
def home():
    return render_template('homepage.html')
@app.route("/p")
def load_post_html():
     return render_template('post_problem.html')
@app.route("/homepage")
def home_():
    # Check if a 'username' parameter is present in the query string
    username = request.args.get('username')
    
    if username:
        # If the username is present, append it to the URL in the template
        return render_template("homepage.html", username=username)
    else:
        # If no username is present, render the homepage without the username
        return render_template("homepage.html")
@app.route('/log')
def login_():
    return render_template('login_page.html')

@app.route('/sign')
def sign_up_():
    return render_template('sign_up.html')
    
@app.route('/login', methods=['POST'])
def login():
    df = pd.read_csv(file_user)
    users = data_manager.extract_dictionary(df, True,['user_name', 'user_password','user_id'])

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print("Username received:", username, "Password received:", password)
    if username in users and users[username][0] == password:

        return jsonify({'success': True})  # Respond with success
    if username in users:
        print(f"Invalid credentials: {username} inputted incorrect password")
    else:
        print(f"Username not found: {username} does not exist")

    return jsonify(success=False, message="Invalid credentials"), 401
@app.route('/logout', methods=['POST'])
def logout():
    print("User logged out successfully")
    return jsonify({"message": "Logged out successfully"}), 200
@app.route('/get_user', methods=['GET'])
def get_user():
    print('session: ', session)
    if 'username' in session:
        print("Current user in session:", session['username'])
        return jsonify({"username": session['username']}), 200
    print("No user logged in")
    return jsonify({"message": "No user logged in"}), 401





@app.route('/post', methods=['POST'])
def handle_post():

    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    username = data.get('username')
    if username == "guest":
        return jsonify({"status": 'error','message':'guests can not post anonymously please log in'})
    print(f"Adding post with title '{title}' by user '{username}'")

    # Add the post using data_manager
    data_manager.add_post(data_manager.next_row_number(file_post), title, username, content)
    print("Post added successfully")
    return jsonify({"status": "success", "message": "Post added successfully!"}), 200


def add_post( post_title, original_poster, post):
    post_id = data_manager.next_row_number(file_post)
    posting_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Format the date
    with open("post_data.csv", mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([post_id, post_title, original_poster, post, posting_date])  # Add the date
    print(f"User {original_poster}'s post about {post_title} added successfully.")

@app.route("/your_posts", methods=["GET"])
def get_your_posts():
    try:
        data = request.args
        print(data)
        username = data.get('username')
        print(username)
        dic = data_manager.get_all_posts()  # Assuming this returns a dictionary
        all_posts = list(dic.items())  # Convert the dictionary to a list of tuples

        # Id, Title, Poster, Date, Post
        response = [
            {"id": Id, "Title": Title, "poster": Poster, "date": Date, "post": Post}
            for Id, [Title, Poster, Date, Post] in all_posts  # Directly iterate over the list of tuples
            if Poster == username  # Filter for posts by the logged-in user
        ]
        print(response[0])
        print("Posts returned for user", username, ":", response)
        return jsonify(response)

    except Exception as e:
        print(f"Error in get_your_posts: {e}")
        return jsonify({"status": "error", "message": "Internal Server Error"}), 500

@app.route('/posts', methods=['GET'])
def get_posts():
    try:
        page = int(request.args.get('page', 1))
        posts_per_page = 5
        start_index = (page - 1) * posts_per_page
        end_index = start_index + posts_per_page

        print("Fetching posts for page", page)
        dic = data_manager.get_all_posts()
        all_posts = list(dic.items())  # Convert dictionary to list for slicing

        # Slice for pagination
        paginated_posts = all_posts[start_index:end_index]
        #Id,Title,Poster,Date,Post
        response = [{"id": Id, "Title": Title,"poster":Poster,"date":Date,"post":Post} for Id,[Title,Poster,Date,Post ]in paginated_posts]

        print("Posts returned for page", page, ":", response)
        return jsonify(response)
    except Exception as e:
        print(f"Error in get_posts: {e}")
        return jsonify({"status": "error", "message": "Internal Server Error"}), 500


@app.route("/delete_post", methods=["POST"])
def delete_post():
    try:
        data = request.get_json()
        post_id = data.get('id')

        # Logic to delete the post from your data storage
        data_manager.delete_post(post_id)  # Assume this function handles deletion

        return jsonify({"status": "success", "message": "Post deleted successfully"})
    except Exception as e:
        print(f"Error in delete_post: {e}")
        return jsonify({"status": "error", "message": "Failed to delete post"}), 500

@app.route("/sign_up",methods = ["POST"])
def sign_up():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if data_manager.is_username_taken(username):
        print("username is taken")
        return jsonify({"status": "error", "message": "username taken"})
    print("username is not taken")
    data_manager.add_user(username, password)


    return jsonify({"status": "success", "message": "User signed up successfully"}), 200



if __name__ == '__main__':
    app.run(debug=True)
