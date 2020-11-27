
$(document).ready(function () {
    var i = 0;
    data_sekarang = null;
    $("button.simpan").click(function () {
        var idd = $("#idd").val();
        var name = $("#name").val();
        var price = $("#price").val();
        i++;
        var data_baru =
            "<tr id='row' class='info'>" +
            "<td class='idd'>" + idd + "</td>" +
            "<td class='name'>" + name + "</td>" +
            "<td class='price'>" + price + "</td>" +
            "<td><button class='btn btn-primary edit'>Cập nhật</button> <button class='btn btn-danger delete'>Xoá</a></button>" +
            "</tr>";
        if (data_sekarang) { //edit data
            $("table tbody").find($(data_sekarang)).replaceWith(data_baru);
            data_sekarang = null;
        } else { //tambah data
            $("table tbody").append(data_baru);
        }
        $("#idd").val('');
        $("#name").val('');
        $("#modal").modal('hide');
    });

    $(document).on('click', 'button.delete', function () {
        var data = $(this).parents('tr');
        bootbox.confirm({
            size: "small",
            message: "Bạn có muốn xoá Data không?",
            buttons: {
                confirm: {
                    label: 'Có',
                    className: 'btn btn-danger',
                },
                cancel: {
                    label: 'Trở về',
                    className: 'btn btn-default',

                }
            },
            callback: function (result) {
                if (result == true) {
                    data.remove();
                }
            }
        })
    });
    $(document).on('click', 'button.edit', function () {
        data_sekarang = $(this).parents('tr');
        $("#idd").val($(this).closest('tr').find('td.idd').text());
        $("#name").val($(this).closest('tr').find('td.name').text());
        $("#modal").modal('show');
        $('#judul').html('Edit');
    });

    $("button.add").click(function () {
        data_sekarang = null;
        $('input').val('');
        $('#judul').html('Thông tin');
    })
    $(document).ready(function () {
        $("#btn1").click(function () {
            $(".id1").remove();
        });
    });


    $(document).on('click', 'button.ud', function () {
        data_sekarang = $(this).parents('tr');
        $("#ProductID").val($(this).closest('tr').find('td.pid').text());
        $("#ProductName").val($(this).closest('tr').find('td.pna').text());
        $("#UpdateProduct").modal('show');
    });
})
