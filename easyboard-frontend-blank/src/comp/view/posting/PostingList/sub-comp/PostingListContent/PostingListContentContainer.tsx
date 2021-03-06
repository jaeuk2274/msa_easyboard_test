import React, { ContextType } from 'react';
import { autobind, ReactComponent, ServiceInjector } from '@nara.drama/prologue';
import { observer } from 'mobx-react';

import { Posting } from '~/comp/api';
import { PostingsStateKeeper, PostingStateKeeper } from '~/comp/state';
import PostingListContext from '../../context/PostingListContext';
import PostingDetailView from './view/PostingDetailView';

interface Props {
  //
  onClickEdit?: (postingId: string) => void;
  onSuccess?: () => void;
  onFail?: () => void;
}

interface InjectedProps {
  //
  postingsStateKeeper: PostingsStateKeeper;
  postingStateKeeper: PostingStateKeeper;
}

@autobind
@observer
class PostingListContentContainer extends ReactComponent<Props, {}, InjectedProps> {
  //
  static defaultProps = {
    onClickEdit: () => {},
    onSuccess: () => {console.log("default onSuccess")},
    onFail: () => {console.log("default onFail")},
  };

  static contextType = PostingListContext;

  context!: ContextType<typeof PostingListContext>;


  onToggle(posting: Posting) {
    //
    const { postingsStateKeeper } = this.injected;
    postingsStateKeeper.setPostingsProp(posting.id, 'expanded', !posting.expanded);
  }

  // TODO: 게시글 수정버튼 이벤트 함수 구현
  onClickEdit(postingId: string) {
    //
    const { postingsStateKeeper } = this.injected;
    postingsStateKeeper.setPostingsProp(postingId, 'editing', true);
  }

  // TODO: 게시글 삭제버튼 이벤트 함수 구현
  onClickRemove(postingId: string) {
    //
    const { postingStateKeeper } = this.injected;
    const { onSuccess, onFail } = this.propsWithDefault;
    const { postingList } = this.context;

    postingStateKeeper.remove(postingId)
                      .then(onSuccess)
                      .catch(onFail)
                      .finally(postingList.init);
  }

  onModify(success: boolean) {
    //
    const { postingList } = this.context;

    postingList.init();
    this.onComplete(success);
  }

  onComplete(success: boolean) {
    //
    const { postingList } = this.context;
    const { onSuccess, onFail } = this.propsWithDefault;

    if (success) {
      onSuccess();
    }
    else {
      onFail();
    }

    postingList.init();
  }

  render() {
    //
    const { postingList } = this.context;
    const { writerName } = postingList;

    const { postingsStateKeeper } = this.injected;
    const { postings } = postingsStateKeeper;

    return postings.map((posting, index) => (
      <PostingDetailView
        key={index}
        posting={posting}
        userId={postingList.userId}
        sourceEntityId={postingList.sourceEntityId}
        sourceEntityName={postingList.sourceEntityName}
        anonymous={false}
        onClickReplies={this.onToggle}
        onClickEdit={this.onClickEdit}
        onClickRemove={this.onClickRemove}
        onModify={this.onModify}
        writerName={writerName}
      />
    ));
  }
}

export default ServiceInjector.useContext(
  PostingsStateKeeper,
  PostingStateKeeper
)(PostingListContentContainer);
