import { Col, Row } from 'antd';
import { useEffect, useState } from "react";
import Header from 'ui/Header';

const Staffing = () => {

  useEffect(() => {
    console.log('render Staffing');
  }, [])

  return (
    <Row style={{ marginRight: 0, marginLeft: 0 }} gutter={[16, 16]}>
      <Col span={24}>
        <Header size="h3">Штатные расписания</Header>
      </Col>
    </Row>
  )
}

export default Staffing;