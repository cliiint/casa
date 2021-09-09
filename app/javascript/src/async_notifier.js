const $ = require('jquery')

module.exports = class Notifier {
  //  @param {object} notificationsElement The notification DOM element as a jQuery object
  constructor (notificationsElement) {
    this.loadingToast = notificationsElement.find('#async-waiting-indicator')
    this.notificationsElement = notificationsElement
    this.savedToast = notificationsElement.find('#async-success-indicator')
    this.waitingSaveOperationCount = 0
  }

  hideLoadingToast () {
    this.loadingToast.hide()
  }

  hideSavedToast () {
    this.savedToast.hide()
  }

  // Adds notification messages to the notification element
  //  @param  {string} message The message to be displayed
  //  @param  {string} level One of the following logging levels
  //    "error"  Shows a red notification
  //    "info"   Shows a green notification
  //  @throws {TypeError}  for a parameter of the incorrect type
  //  @throws {RangeError} for unsupported logging levels

  notify (message, level) {
    if (typeof message !== 'string') {
      throw new TypeError('Param message must be a string')
    }

    const escapedMessage = message.replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

    switch (level) {
      case 'error':
        this.notificationsElement.append(`
          <div class="async-failure-indicator">
            Error: ${escapedMessage}
            <button class="btn btn-danger btn-sm">×</button>
          </div>`)
          .find('.async-failure-indicator button').click(function () {
            $(this).parent().remove()
          })
        break
      case 'info':
        this.notificationsElement.append(`
          <div class="async-success-indicator">
            ${escapedMessage}
            <button class="btn btn-success btn-sm">×</button>
          </div>`)
          .find('.async-success-indicator button').click(function () {
            $(this).parent().remove()
          })

        break
      default:
        throw new RangeError('Unsupported option for param level')
    }
  }

  // Increases the count of asynchronous operations to wait for and shows the loading toast
  startAsyncOperation () {
    this.waitingSaveOperationCount++
    this.loadingToast.show()
  }

  // Decrease the count of asynchronous operations to wait for and shows the saved toast for 2 seconds
  stopAsyncOperation () {
    this.waitingSaveOperationCount--
    this.showSavedToast()

    setTimeout(() => {
      this.hideSavedToast()
    }, 2000)
  }

  // Shows the toast indicating an async operation is in progress
  showLoadingToast () {
    this.loadingToast.show()
  }

  // Shows the toast indicating an async operation has completed
  showSavedToast () {
    this.savedToast.show()
  }
}
