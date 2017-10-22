import React, { Component } from 'react';
import PostsList from '../../components/posts-list'

class mineFollow extends React.Component {

  static navigationOptions = {
    header: null,
    title: '关注'
  }

  render() {

    const { navigation } = this.props
    
    return <PostsList
              {...this.props}
              tabLabel='话题'
              navigation={navigation}
              name="follow"
              filters={{
                weaken: 1,
                method: 'user_custom',
                include_comments: 1,
                comments_sort: 'create_at:-1',
                device: 'ios'
              }}
              />
  }
}

export default mineFollow
