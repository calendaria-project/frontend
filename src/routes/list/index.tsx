import { Col, Collapse, Row, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import './list.scss'

const { Panel } = Collapse;

export interface IItem {
    label: string;
    id: number;
    children: IItem[]
}

const getItemData = (size: number): Promise<IItem[]> => {
    return new Promise((res, rej) => {
        setTimeout(async () => {
            let items: IItem[] = []
            for (let i = 0; i < size; i++) {
                const id = await GetAsyncId()
                items.push({
                    label: `Title ${i}`,
                    id: id,
                    children: []
                })
            }
            return res(items)
        }, 1000)
    })
}

const GetAsyncId = (): Promise<number> => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            return res(new Date().getTime())
        }, 100)
    })
}

const List: React.FC = () => {

    const [data, setData] = useState<IItem[]>([])
    const [activeKey, setActiveKey] = useState<number | undefined>()

    const onChange = (key: string | string[]) => {
        if (Array.isArray(key)) {
            setActiveKey(+key[0])
        } else {
            setActiveKey(+key)
        }
    }

    useEffect(() => {
        getData(null, 0)
    }, [])

    useEffect(() => {
        if (activeKey) {
            getData(activeKey, data.length)
        }
    }, [activeKey])

    const getData = async (activeId: number | null, length: number) => {
        let items = await getItemData(length + 1)
        console.log('sended request')
        if (activeId) {
            const newData = searchAndUpdateChilds(data, activeId, items)
            setData(newData)
        } else {
            setData(items)
        }
    }

    const searchAndUpdateChilds = (objOrArray: IItem[], id: number, children: IItem[]) => {
        let arrayOrObj = Object.assign((objOrArray.constructor === Array ? [] : {}), objOrArray)
        for (let item in arrayOrObj) {
            if (arrayOrObj[item].id === id) {
                arrayOrObj[item].children = children;
            } else if (typeof arrayOrObj[item] === 'object') {
                arrayOrObj[item].children = searchAndUpdateChilds(arrayOrObj[item].children, id, children)
            }
        }
        return arrayOrObj;
    }

    const getArrayItem = (key: string | string[]) => Array.isArray(key) ? key[0] : key

    const GetAccordionItem = (item: IItem) => {
        const children = item.children
        const isExistChildren = children && children.length !== 0

        return (
            <Panel header={item.id} key={item.id}>
                {
                    isExistChildren ?
                        <Collapse onChange={onChange} >
                            {children.map(GetAccordionItem)}
                        </Collapse>
                        :
                        <div></div>
                }
            </Panel>
        )
    }

    return (
        <Content>
            <Row>
                <Col span={24} >
                    <Collapse onChange={onChange}>
                        {
                            data.map(GetAccordionItem)
                        }
                    </Collapse>
                </Col>
            </Row>
        </Content>
    )
}

export default List