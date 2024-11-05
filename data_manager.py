import csv,pandas
import datetime

import pandas as pd
user_file = "user_data.csv"
def df_provider(file):
    return pd.read_csv(file)
def extract_row_data(df, column, value):
    if column in df.columns:
        row_data = df[df[column] == value]
        row_index = row_data.index.tolist()
        col_index = df.columns.get_loc(column)
        if row_data.empty:
            print(f"No rows found with {column} == {value}.")
            return None
        return row_data, row_index, col_index
    else:
        print(f"Error: Column '{column}' does not exist in the provided file.")
        return None
def is_username_taken(username):
    data = extract_row_data(df_provider(user_file), column = "user_name", value = username)
    if data == None:        return False
    else:        return True

def add_user(username, password):
        df = df_provider(user_file)
        df = df._append({"user_id":next_row_number(user_file),'user_name': username, 'user_password': password,"coins":0,"date":datetime.datetime.now().date()}, ignore_index=True)
        df.to_csv(user_file, index=False)
        print(f"User {username} added successfully.")

def delete_post(post_id, filename="post_data2.csv"):
        is_edited = False
        print(post_id ,"is the post id received")
        print("delete post reached")
        updated_rows = []
        with open(filename, mode='r') as file:
            print("delete post- file viewed")
            reader = csv.reader(file)
            for row in reader:
                print(row[0], type())
                if row[0] != post_id:

                    updated_rows.append(row)
                else: print(" row to be deleted: ",row)

        if is_edited:
         print("delete post- df successfully edited")
         with open(filename, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(updated_rows)
         print("delete post- file updated")

        else: raise Exception ("no post found with the same post id please check the delete function ")
def extract_dictionary(df, Is_user:bool,columns:list):
    dictionary = {}
    print("first line of extract dictionary reached")
    if Is_user:
        for i in range(len(df) - 1, -1, -1):
            row = df.iloc[i]
            key = row[columns[0]]  # First column as the key
            value1 = row[columns[1]]  # Second column as the value
            value2 = row[columns[2]]  # Third column as the content

            if pd.notna(key) and pd.notna(value1):
                dictionary[key] = [value1, value2]  # Add to dictionary

        return dictionary
    for i in range(len(df) - 1, -1, -1):

        row = df.iloc[i]# First column as the key
        title = row[columns[1]] #  First valuea as the title
        post_content = row[columns[2]]  # Second column as the post
        username = row[columns[3]]  # Third column as the username
        date = row[columns[4]]  # Fourth column as the posting date

        if pd.notna(i) and pd.notna(title) and pd.notna(post_content) and pd.notna(username) and pd.notna(date):
            dictionary[i+1] = [title, post_content, username, date]  # Add to dictionary

    return dictionary

def next_row_number(file_path):
    df= pandas.read_csv(file_path)
    if not df.empty:
        return df.iloc[-1]['user_id'] + 1
def add_post(post_id,post_title,original_poster,post):
    with open("post_data.csv", mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([post_id,post_title,original_poster,post])
    print(f"User {original_poster}'s post about {post_title} added successfully.")
def edit_cell(file, row_number, column, new_value):
    df = pd.read_csv(file, dtype=str)
    if row_number in df.index and column in df.columns:
        df.at[row_number, column] = new_value
        df.to_csv(file, index=False)
        print(f"Updated row {row_number}, column '{column}' with new value: {new_value}")
    else:
        print(f"Error: Row {row_number} or column '{column}' does not exist.")
    return pd.read_csv(file, dtype=str)
def get_all_posts():
    posts = pd.read_csv('post_data2.csv')
    print("get all posts endpoint reached, not a problem with vague function might be a problem with extract dictionary")
    return extract_dictionary(posts,False,['Id','Title','Poster',"Date",'Post'])

if __name__ == "__main__":
 file = 'user_data.csv'
 column = 'user_name'
 add_user("ats_2","black2")