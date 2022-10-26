function dataPagination(match, sort, page = 1, limit = 10, join = false) {
  const aggregate = [{ $match: match }];
  let data = [];
  data.push({ $sort: sort });

  if (page > 1) {
    let skip = (page - 1) * limit;
    data.push({ $skip: skip });
  }
  data.push({ $limit: parseInt(limit) });
  if (join) {
    join.forEach((item) => data.push(item));
  }
  let facet = {
    metadata: [
      { $count: "recordTotal" },
      { $addFields: { pageCurrent: page, recordPerPage: limit } },
    ],
    data: data,
  };
  aggregate.push({ $facet: facet });
  return aggregate;
}

async function sendPass(newpass, email) {
  try {
    console.log(oauth2Client);
    const accessToken = oauth2Client.getAccessToken();
    console.log("accessToken", accessToken);
    // const transport = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     type: "OAuth2",
    //     user: "hethongquanliweb@gmail.com",
    //     clientId: config.GOOGLE_CLIENT_ID,
    //     clientSecret: config.GOOGLE_CLIENT_SECRET,
    //     refreshToken: config.GOOGLE_REFRESH_TOKEN,
    //     accessToken: accessToken,
    //   },
    // });
    // const mainOptions = {
    //   // thiết lập đối tượng, nội dung gửi mail
    //   from: "<hethongquanliweb@gmail.com>",
    //   to: email,
    //   subject: "Test Nodemailer",
    //   text: newpass,
    //   html: `<div style="background-color: #ea562dda; padding: 2em 2em;">
    //                   <h4 style="text-align: center;">Hello your new password is ${newpass}. Please return to the login screen to continue!</h4>
    //               </div>`,
    // };
    // transport.sendMail(mainOptions, (error) => {
    //   if (error) {
    //     return console.log(error);
    //   }
    // });
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  dataPagination,
  sendPass,
};
