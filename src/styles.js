import styled from 'styled-components';

const eventList = {
  width: '700px',
  margin: '2% auto',
  borderRadius: '6px',
  backgroundColor: 'white',
  padding: "0",
  
}

const listContainer = {
  backgroundColor: 'linear-gradient(#f4f0f3, #f2f0f5, #f0f1f7, #edf2f7, #eaf3f7)'
}

const eventBox = {
  boxShadow: '0px 1px 5px #888, 0px -1px 2px rgba(0, 0, 0, 0.1)',
  padding: '26px 20px',
  display: 'flex'
}

const eventHeader = {
  flex: '0',
  paddingRight: '15px'
}

const eventFooter = {
  flex: '1',
  textOverflow: 'ellipsis',
  overflow: 'hidden'
}

const firstItem = styled.div`
      &:first-of-type {
        color: red;
      }
`;

const avatar = {
  borderRadius: '100px'
}


const descriptionText = {
  fontFamily: 'Muli',
  fontSize: '14px',
  fontWeight: '400',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  //whiteSpace: 'nowrap'
}

const heavyDescription = {
  fontWeight: '700',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  //whiteSpace: 'nowrap'
};

const dateText = {
  fontFamily: 'Muli',
  fontSize: '12px',
  color: '#888'
}

export const styles = {
  eventList: eventList,
  listContainer: listContainer,
  eventBox: eventBox,
  eventHeader: eventHeader,
  eventFooter: eventFooter,
  avatar: avatar,
  descriptionText: descriptionText,
  dateText: dateText,
  firstItem: firstItem,
  heavyDescription: heavyDescription
}


