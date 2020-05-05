const request = require('request');
const { Cushion, Device, Doll} = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment');

//device/cushion/{dollId}/{year}/{month}/
// device/cushion/{dollId}/today/

module.exports = {
  /**
   *
   * @swagger
   *  /device/cushion/:
   *    get:
   *      tags:
   *      - Device
   *      description: 방석과 연결 된 인형 정보
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *
   *      responses:
   *       200:
   *        description: 인형 정보
   *
   *
   * @swagger
   *  /device/cushion/{dollId}/today:
   *    get:
   *      tags:
   *      - Device
   *      description: 실시간 오늘 방석 상태
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: dollId
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 방석 기본 데이터
   *
   *
   * @swagger
   *  /device/cushion/{dollId}/{year}/{month}/:
   *    get:
   *      tags:
   *      - Device
   *      description: monthly
   *      produces:
   *      - applicaion/json
   *      - application/xml
   *      parameters:
   *      - name: haveCookie
   *        in: cookie
   *        schema:
   *          type: string
   *      - name: dollId
   *        in: path
   *        type: int
   *      - name: year
   *        in: path
   *        type: int
   *      - name: month
   *        in: path
   *        type: int
   *
   *      responses:
   *       200:
   *        description: 월별 방석 데이터
   *
   */

  get_cushion_doll: async (req, res, next) => {
    try {
      const dollSet = await Doll.findAll({
        attributes: ['id'],
        where: {
          userId: req.user.id,
        }
      });

      const dollIdSet = await dollSet.map(r => r.id);
      const cushion = await Device.findByPk(1);
      const cushionSet = await cushion.getDolls({
        attributes: ['id', 'dollName'],
        where: {
          id: {[Op.or]: dollIdSet},
        }
      });

      return res.status(200).json({
        cushionSet,
      })
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  get_cushion_data_now: async(req, res, next) => {
    try {
      const doll = await Doll.findByPk(req.params.dollId);
      const date = moment().format('YYYY.MM.DD');
      if (doll) {
        if (req.user.id === doll.userId) {
          await request.get({
            url: doll.domain + '/data/today/'
          }, async function(err, response, body){
            if(err){
              console.error(err);
              next(err);
            };
            if (response && response.statusCode === 200) {
              // console.log(JSON.parse(body));
              return res.status(200).json({
                data: JSON.parse(body),
                date,
                message: '인형에서 받아 온 데이터'
              })
            } else {
              const data = await Cushion.findOne({
                attributes: ['id', 'middle_', 'front_', 'left_', 'right_twisted_',
                'left_twisted_', 'right_', 'back_'],
              where: {id: 1 }
              });
              delete data["createdAt"];
              delete data["updatedAt"];
              return res.status(200).json({
                data: data,
                date,
                message: '인형과의 연결이 불안정합니다. 연결을 확인해주세요.'
              })
            }
          })
        } else {
          return res.status(403).json({
            message: '권한이 없습니다.'
          })
        }
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  get_cushion_data_month: async (req, res, next) => {
    try {
      const year = req.params.year;
      const month = req.params.month;
      const doll = await Doll.findByPk(req.params.dollId);
      if (doll) {
        if (req.user.id === doll.userId) {
          await request.get({
            url: doll.domain + '/data/' + year + '/' + month,
          }, async function(err, response, body){
            if (err){
              console.error(err);
              next(err);
            }
            else if (response && response.statusCode === 200) {
              const receivedData = JSON.parse(body);

              const graphData = {};

              const date = year + '-' + month;
              const endDate = moment(date, "YYYY-MM").daysInMonth();
              for (let d=1; d <= endDate; d++) {
                graphData[d] = {};
              }

              for (let j=0; j < receivedData.length; j++) {
                const dayInfo = moment(receivedData[j].date).format('DD');
                graphData[dayInfo].data = receivedData[j]
              }
              return res.status(200).json({
                date: endDate,
                graphData
              })
            } else {

              const graphData = {};
              const date = year + '-' + month;
              const startDate = date + '-'+'01';
              const endDate = date + '-' + moment(date, "YYYY-MM").daysInMonth();

              const receivedData = await Cushion.findAll({
                attributes: ['id', 'middle_', 'front_', 'left_', 'right_twisted_',
                  'left_twisted_', 'right_', 'back_',
                  [sequelize.fn('DATE', sequelize.col('cushion.createdAt')), 'date'],
                ],
                where: {
                  createdAt: {
                    [Op.gte]: moment(startDate).format('YYYY-MM-DD'),
                    [Op.lte]: moment(endDate).format('YYYY-MM-DD'),
                  },
                },
                raw: true,
              });

              const tt = moment(date, "YYYY-MM").daysInMonth();
              for (let d=1; d <= tt; d++) {
                graphData[d] = {};
              }

              for (let j=0; j < receivedData.length; j++) {
                const dayInfo = moment(receivedData[j].date).format('DD');
                graphData[dayInfo].data = receivedData[j]
              }

              return res.status(200).json({
                date: tt,
                graphData,
                message: '인형과의 연결이 불안정합니다. 연결을 확인해주세요.'
              })
            }
          })
        } else {
          return res.status(403).json({
            message: '권한이 없습니다.'
          })
        }
      } else {
        return res.status(403).json({
          message: '존재하지 않는 인형입니다.'
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
