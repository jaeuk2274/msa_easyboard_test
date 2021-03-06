
import React from 'react';
import { observer } from 'mobx-react';
import { autobind, ReactComponent } from '@nara.drama/prologue';


interface Props {
  children: React.ReactNode;
}


@autobind
@observer
class PostingFormBaseView extends ReactComponent<Props> {
  //
  render() {
    //
    return this.props.children;
  }
}

export default PostingFormBaseView;
