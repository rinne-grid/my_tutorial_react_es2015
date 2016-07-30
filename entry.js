import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery'

class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
        this.url = this.props.url;
        this.pollInterval = this.props.pollInterval;

        this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }

    loadCommentsFromServer() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cached: false,
            success: (data) => {
                this.setState({data: data});
            },
            error: (xhr, status, err) => {
                //console.error(this.url, status, err.toString());
            }
        });
    }

    handleCommentSubmit(comment) {
        var comments = this.state.data;
        comment.id = Date.now();
        var newComments = comments + comment;
        this.setState({data: newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: (data) => {
                this.setState({data: data});
            },
            error: (xhr, status, err) => {
                this.setState({data: comments});
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    componentDidMount() {
        //$.ajax({
        //    url: this.url,
        //    dataType: 'json',
        //    cache: false,
        //    success: (data) => {
        //        this.setState({data: data});
        //    },
        //    error: (xhr, status, err) => {
        //        console.error(this.url, status, err.toString());
        //    }
        //});
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.pollInterval);
    }

    render() {
        return (
            <div className="commentBox">
               <h1>Comments</h1>
               <CommentList data={this.state.data}/>
               <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
}

class CommentList extends Component {
    render() {

        var commentNodes = this.props.data.map( 
            (comment) => { 
                return (
                    <Comment author={comment.author} key={comment.id}>
                        {comment.text}
                    </Comment>
                );
            }
        );
        
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
}

class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {author: '', text: ''};
        this.onCommentSubmit = this.props.onCommentSubmit;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);

    }

    handleAuthorChange(e) {
        this.setState({author: e.target.value});
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if(!text || !author) {
            return;
        }

        // TODO: サーバーに要求を送信
        this.onCommentSubmit({author: author, text: text});
        this.setState({author: '', text: ''});
    }

    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text"
                       placeholder="Your name"
                       value={this.state.author}
                       onChange={this.handleAuthorChange}
                />
                <input type="text"
                       placeholder="Say something..."
                       value={this.state.text}
                       onChange={this.handleTextChange}
                />
                <input type="submit" value="Post" />
            </form>
        );
    }
}

class Comment extends Component {
    rawMarkup() {
        let md = new Remarkable();
        let rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    }
    render() {
        const author = this.props.author;
        const children = this.props.children;

        let md = new Remarkable();

        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
}


let data = [
    {id: 1, author: "Pete Hunt", text: "This is h comment."},
    {id: 2, author: "Jordan Walke", text:"This is w comment."}
];

render(
    <CommentBox url="/api/comments" pollInterval={2000}/>,
    document.getElementById("container")
);
